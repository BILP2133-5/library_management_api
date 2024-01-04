import express from 'express';
import * as AuthController from '../controllers/auth.controller';
import { authenticate } from '../middleware/authMiddleware';

const authRouter = express.Router();

authRouter.get('/protected', authenticate, AuthController.protectedRoute);

authRouter.post('/register', AuthController.register);
authRouter.post('/createUser', AuthController.createAdmin);
authRouter.post('/login', AuthController.login);

export default authRouter;
