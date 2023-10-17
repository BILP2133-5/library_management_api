import express from 'express';
import * as bookController from '../controllers/book.controller';

const bookRouter = express.Router();

bookRouter.get('/', bookController.listBooks);
bookRouter.get('/:id', bookController.findById);
bookRouter.delete('/remove/:id', bookController.removeById);
bookRouter.put('/update/:id', bookController.updateBook);
bookRouter.post('/add', bookController.addBook);
bookRouter.post('/loan/:bookId', bookController.loanBook);

export default bookRouter;
