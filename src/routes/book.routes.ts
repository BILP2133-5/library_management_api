import express from 'express';
import * as BookController from '../controllers/book.controller';

const bookRouter = express.Router();

bookRouter.get('/', BookController.listBooks);
bookRouter.get('/:id', BookController.getBookById);
bookRouter.get('/search/:query', BookController.searchBooks);

bookRouter.put('/update/:id', BookController.updateBook);
bookRouter.post('/add', BookController.addBook);
bookRouter.post('/loan/:bookId', BookController.loanBook);

bookRouter.delete('/remove/:id', BookController.removeById);

export default bookRouter;
