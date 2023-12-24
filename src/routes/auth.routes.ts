import express from 'express';
import * as authController from '../controllers/auth.controller';
import { requireAuth } from '../middleware/authMiddleware';

const authRouter = express.Router();

authRouter.get('/protected', requireAuth, authController.protectedRoute);

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

export default authRouter;
