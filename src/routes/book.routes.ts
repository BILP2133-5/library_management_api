import express from 'express';
import * as BookController from '../controllers/book.controller';

const bookRouter = express.Router();

bookRouter.get('/', BookController.listBooks);
bookRouter.get('/:id', BookController.getBookById);
bookRouter.get('/search/:query', BookController.searchBooks);

bookRouter.put('/update/:id', bookController.updateBook);
bookRouter.post('/add', bookController.addBook);
bookRouter.post('/loan/:bookId', bookController.loanBook);
bookRouter.post('/unloan/:bookId', bookController.unloanBook);

bookRouter.delete('/remove/:id', BookController.removeBookById);

export default bookRouter;
