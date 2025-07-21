import User from '../models/user.model.js'; // Importing the User model
import Notification from '../models/notification.model.js'; // Importing the Notification model

import bcrypt from 'bcryptjs'; // Importing bcrypt for password hashing
import { v2 as cloudinary } from 'cloudinary'; // Importing Cloudinary for image uploads

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImage: user.profileImage,
            coverImage: user.coverImage,
        });
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params; // User ID to follow/unfollow
        const userId = req.user._id; // Current user ID from the request

        if (id === userId.toString()) {
            return res.status(400).json({ message: 'You cannot follow/unfollow yourself' });
        }

        const userToFollow = await User.findById(id);
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentUser = await User.findById(userId);
        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow the user
            currentUser.following.pull(id);
            userToFollow.followers.pull(userId);

            const notification = await Notification.findOneAndDelete({
                type: 'unfollow',
                from: currentUser._id,
                to: userToFollow._id,
            });


        } else {
            // Follow the user
            currentUser.following.push(id);
            userToFollow.followers.push(userId);

            const notification = new Notification({
                type: 'follow',
                from: currentUser._id,
                to: userToFollow._id,
            });
            await notification.save(); // Save the notification if you have a Notification model
        }

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({
            message: 'Follow/Unfollow action successful',
            following: currentUser.following,
            followers: userToFollow.followers,
        });
    } catch (error) {
        console.error('Error in follow/unfollow action:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getSuggestedProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Get the current user's ID from the request
        const currentUser = await User.findById(userId).select('-password'); // Exclude password from the response

        if (!currentUser) {
            return res.status(404).json({ message: 'Current user not found' });
        }

        // Find users who are not followed by the current user and are not the current user
        const suggestedUsers = await User.find({
            _id: { $ne: userId, $nin: currentUser.following },
        }).select('-password').limit(10); // Limit to 10 suggested users

        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.error('Error getting suggested profiles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Get the current user's ID from the request
        const { fullName, username, email, profileImage, coverImage, newPassword, currentPassword, bio, link } = req.body;
        const user = await User.findById(userId); // Exclude password from the response

        if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
            return res.status(400).json({ message: 'Both new password and current password must be provided' });
        }

        // Check if the new password matches the current password
        if (newPassword && currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'New password must be at least 6 characters long' });
            }
            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImage) {
            if(user.profileImage) {
                await cloudinary.uploader.destroy(user.profileImage.split("/").pop().split(".")[0]); // Delete old profile image if it exists
            }

            const uploadedImage = await cloudinary.uploader.upload(profileImage);
            profileImage = uploadedImage.secure_url; // Get the secure URL of the uploaded image
        }
        if (coverImage) {
            if(user.coverImage) {
                await cloudinary.uploader.destroy(user.coverImage.split("/").pop().split(".")[0]); // Delete old cover image if it exists
            }

            const uploadedCoverImage = await cloudinary.uploader.upload(coverImage);
            coverImage = uploadedCoverImage.secure_url; // Get the secure URL of the uploaded cover image
        }
        
        // Prepare the update object
        user.fullName = fullName || user.fullName;
        user.username = username || user.username;
        user.email = email || user.email;
        user.profileImage = profileImage || user.profileImage;
        user.coverImage = coverImage || user.coverImage;
        user.bio = bio || user.bio;
        user.link = link || user.link;

        // Find the user and update their profile
        const updatedUser = await user.save();
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            username: updatedUser.username,
            email: updatedUser.email,
            followers: updatedUser.followers,
            following: updatedUser.following,
            profileImage: updatedUser.profileImage,
            coverImage: updatedUser.coverImage,
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}