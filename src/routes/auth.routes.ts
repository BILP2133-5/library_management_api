import express from 'express';
import * as authController from '../controllers/auth.controller';
import { authorize } from '../middleware/authMiddleware';

const authRouter = express.Router();

authRouter.get('/protected', authorize, authController.protectedRoute);

authRouter.post('/register', authController.register);
authRouter.post('/createUser', authController.createAdmin);
authRouter.post('/login', authController.login);

export default authRouter;
