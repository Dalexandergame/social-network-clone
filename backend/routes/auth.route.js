import express from 'express';
import { getCurrentUser,signup, login, logout } from '../controllers/auth.controller.js'; // Importing the signup controller
import { protectRoute } from '../middleware/protectRoute.js'; // Importing the protectRoute middleware

const router = express.Router();

router.get('/getcurrentuser', protectRoute, getCurrentUser); // Assuming protectRoute is a middleware to authenticate the user')

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

export default router;