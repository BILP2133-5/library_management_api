import express from 'express';
import * as userController from '../controllers/user.controller';
import { isAdmin, isSuperadmin, requireAuth } from '../middleware/authMiddleware';

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:userId', userController.getUserByID);
userRouter.get('/borrowedBook/:userId',userController.getUserBorrowedBooks);

userRouter.put('/updaterole',requireAuth, isSuperadmin, userController.updateUserRole);
userRouter.delete('/remove/:id', requireAuth ,isAdmin, userController.removeUserByID);

export default userRouter;
