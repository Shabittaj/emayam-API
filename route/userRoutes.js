import express from 'express';
import { getAllUser, loginUser, profile, registerUser } from '../controller/userControllers.js';
import { userAuth } from '../middleware/authMiddleware.js';
const router = express.Router()

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/allUsers", getAllUser);

router.get("/profile", userAuth, profile);

export default router;