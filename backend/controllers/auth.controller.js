import bcrypt from 'bcryptjs';
import User from '../models/user.model.js'; // Assuming you have a User model defined
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js'; // Assuming you have a utility function to generate JWT and set cookie

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    // Here you would typically handle user registration logic
    const emailRegex = /.+\@.+\..+/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash the password (you would typically use bcrypt or similar)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullName,
        username,
        email,
        password: hashedPassword,
    });
    
    if (newUser) {
        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: { _id: newUser._id, fullName: newUser.fullName, username: newUser.username, email: newUser.email, followers: newUser.followers, following: newUser.following, profileImage: newUser.profileImage, coverImage: newUser.coverImage } });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (error) {
    console.error('Error during signup in controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
    
        // Find user by username
        const user = await User.findOne({ username });
        const isPasswordValid = user && await bcrypt.compare(password, user?.password || '');

        if (!user || !isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(user._id, res);
        
        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                followers: user.followers,
                following: user.following,
                profileImage: user.profileImage,
                coverImage: user.coverImage,
            }
        });

    } catch (error) {
        console.error('Error during login in controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = async (req, res) => {
  // Here you would typically handle user logout logic
  try {
    res.cookie("token", '', {maxAge:0});
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout in controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?._id; // Assuming req.user is populated by a middleware
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password'); // Exclude password from response
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
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}