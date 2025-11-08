import User from "../models/user.model.js";
import Post from "../models/post.model.js";

import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js"; // Importing the Notification model

export const createPost = async (req, res) => {
    try {
        const { text, image } = req.body; // Assuming content and image are sent in the request body
        const userId = req.user._id; // Get the current user's ID from the request
        const user = await User.findById(userId).select('-password'); // Exclude password from the response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!text && !image) {
            return res.status(400).json({ message: 'Content or image is required' });
        }

        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image); // Upload image to Cloudinary);
            image = uploadedImage.secure_url; // Get the secure URL of the uploaded image
        }

        const newPost = new Post({
            text,
            image,
            user: userId,
        });

        await newPost.save();

        res.status(201).json({
            message: 'Post created successfully',
            post: newPost,
        });
    } catch (error) {
        console.error('Error creating post in Controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id; // Get the post ID from the request parameters
        const userId = req.user._id; // Get the current user's ID from the request

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        if (post.image) {
            // If the post has an image, delete it from Cloudinary
            const imageId = post.image.split('/').pop().split('.')[0]; // Extract public ID from the image URL
            await cloudinary.uploader.destroy(imageId); // Delete the image from Cloudinary
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post in Controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const postId = req.params.id; // Get the post ID from the request parameters
        const { text } = req.body; // Get the comment text from the request body
        const userId = req.user._id; // Get the current user's ID from the request

        if (!text) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            user: userId,
            text,
        };

        post.comments.push(comment);
        await post.save();

        res.status(201).json({
            message: 'Comment added successfully',
            comment,
        });
    } catch (error) {
        console.error('Error commenting on post in Controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const likeUnlikePosts = async (req, res) => {
    try {
        const postId = req.params.id; // Get the post ID from the request parameters
        const userId = req.user._id; // Get the current user's ID from the request

        const post = await Post.findById(postId);
        const user = await User.findById(userId).select('-password'); // Exclude password from the response

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userLikedPost = post.likes.includes(userId);
        
        if (userLikedPost) {
            // If already liked, unlike the post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, {$pull: {likedPosts: postId } }); // Remove post from user's liked posts

            const updatedLikes = post.likes.filter(id => id.toString() !== userId.toString())

            res.status(200).json(updatedLikes);

        } else {
            // If not liked, like the post
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } }); // Add post to user's liked posts
            await post.save();

            const notification = new Notification({
                type: 'like',
                from: userId,
                to: post.user,
            });

            await notification.save(); // Save the notification if you have a Notification model
            const updatedLikes = post.likes
            res.status(200).json(updatedLikes)
        }

    } catch (error) {
        console.error('Error liking/unliking post in Controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', '-password').sort({ createdAt: -1 }).populate('comments.user', '-password'); // Populate user details excluding password
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts in Controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.user._id; // Get the current user's ID from the request
        const user = await User.findById(userId).select('-password').populate('likedPosts'); // Exclude password and populate liked posts

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }).populate('user', '-password').populate('comments.user', '-password'); // Fetch liked posts and populate user details

        res.status(200).json(likedPosts);
    } catch (error) {
        console.error('Error fetching liked posts in Controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id; // Get the current user's ID from the request
        const user = await User.findById(userId).select('-password'); // Exclude password from the response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followingPosts = await Post.find({ user: { $in: user.following } })
            .populate('user', '-password')
            .sort({ createdAt: -1 })
            .populate('comments.user', '-password'); // Populate user details excluding password

        res.status(200).json(followingPosts);
    } catch (error) {
        console.error('Error fetching following posts in Controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const username = req.params.username; // Get the username from the request parameters
        const user = await User.findOne({ username }).select('-password'); // Exclude password from the response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = await Post.find({ user: user._id })
            .populate('user', '-password')
            .sort({ createdAt: -1 })
            .populate('comments.user', '-password'); // Populate user details excluding password

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching user posts in Controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}