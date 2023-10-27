import express from 'express';
import * as userController from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:userId', userController.getUserByID);
userRouter.put('/updaterole',userController.updateUserRole);
userRouter.get('/borrowedBook/:userId',userController.getUserBorrowedBooks);
userRouter.delete('/remove/:id',userController.removeUserByID);

export default userRouter;
