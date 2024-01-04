import express from 'express';

import * as BookController from '../controllers/book.controller';
import { authorize } from '../middleware/authMiddleware';

const bookRouter = express.Router();

bookRouter.get('/', BookController.listBooks);
bookRouter.get('/:id', BookController.getBookById);
bookRouter.get('/search/:query', BookController.searchBooks);

bookRouter.put('/update/:id', BookController.updateBook);
bookRouter.post('/add', BookController.addBook);
bookRouter.post('/loan/:bookId', BookController.loanBook);
bookRouter.post('/unloan/:bookId', authorize(["admin", "superadmin"]), BookController.loanBook);

bookRouter.delete('/remove/:id', BookController.removeBookById);

export default bookRouter;
