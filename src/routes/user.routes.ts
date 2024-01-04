import express from 'express';

import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/authMiddleware';

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:userId', userController.getUserById);
userRouter.get('/borrowedBook/:userId',userController.getUserBorrowedBooks);

userRouter.delete('/remove/:id', authenticate, authorize(["superadmin"]), userController.removeUserByID);

export default userRouter;
