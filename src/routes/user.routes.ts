import express from 'express';
import * as userController from '../controllers/user.controller';
import { authorize } from '../middleware/authMiddleware';

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:userId', userController.getUserById);
userRouter.get('/borrowedBook/:userId',userController.getUserBorrowedBooks);

userRouter.put('/updaterole', authorize(undefined), userController.updateUserRole);
userRouter.delete('/remove/:id', authorize(["superadmin"]), userController.removeUserByID);

export default userRouter;
