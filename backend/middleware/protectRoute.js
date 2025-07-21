import User from "../models/user.model.js";
import { verifyToken } from "../lib/utils/generateToken.js"; // Assuming you have a utility function to verify JWT

export const protectRoute = async (req, res, next) => {
    try { 
        
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        // Verify the token
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        // Find the user by ID from the decoded token
        const user = await User.findById(decoded.id.userId).select('-password'); // Exclude password from the response

        //console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Attach user to the request object
        next(); // Proceed to the next middleware or route handler
        
    } catch (error) {
        console.error('Error in protectRoute middleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};