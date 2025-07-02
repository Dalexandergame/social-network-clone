import express from 'express';
import { signup, login, logout } from '../controllers/auth.controller.js'; // Importing the signup controller

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

export default router;