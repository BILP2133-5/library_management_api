import express from 'express';
import * as bookController from '../controllers/book.controller';

const bookRouter = express.Router();

bookRouter.get('/', bookController.listBooks);
bookRouter.post('/add', bookController.addBook);
bookRouter.post('/loan/:bookId', bookController.loanBook);

export default bookRouter;
