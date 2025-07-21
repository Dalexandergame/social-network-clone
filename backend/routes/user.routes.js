import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile, getSuggestedProfile, followUnfollowUser, updateProfile } from '../controllers/user.controller.js'; // Importing user controllers

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the User Routes!');
});

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedProfile);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/updateprofile", protectRoute, updateProfile);

export default router;