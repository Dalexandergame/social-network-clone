import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { 
    createPost, 
    deletePost, 
    commentOnPost, 
    likeUnlikePosts, 
    getAllPosts, 
    getLikedPosts, 
    getFollowingPosts, 
    getUserPosts
} from '../controllers/post.controller.js'; // Importing post controllers

const router = express.Router();

router.get('/all', protectRoute, getAllPosts); // Get all posts
router.get('/following', protectRoute, getFollowingPosts); // Get all liked posts
router.get('/likes/:id', protectRoute, getLikedPosts); // Get likes on a post
router.get('/user/:username', protectRoute, getUserPosts); // Get liked posts by the user
router.post('/create', protectRoute, createPost);
router.post('/like/:id', protectRoute, likeUnlikePosts);
router.post('/comment/:id', protectRoute, commentOnPost);
router.delete('/delete/:id', protectRoute, deletePost);
//router.get('/get/:id', protectRoute, getPostById);

export default router;