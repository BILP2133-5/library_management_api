import { Request, Response } from 'express';
import * as BookService from '../services/book.service';
import { Types } from 'mongoose';
import { IBook } from '../models/book.model'; 

export async function listBooks(req: Request, res: Response): Promise<void> {
    try {
        const books = await BookService.listBooks();

        res.status(200).json(books);
    } catch (error) {
        if (error instanceof Error) {
            return void res.status(500).json({ error: error.message });
        }
        
        return void res.status(500).json({ error: 'Internal server error.' });
    }
}

export async function addBook(req: Request, res: Response): Promise<void> {
    try {
        const bookData: Partial<IBook> = req.body;
        const newBook = await BookService.addBook(bookData);
        
        res.status(201).json(newBook);
    } catch (error) { 
        if (error instanceof Error) {
            return void res.status(500).json({ error: error.message });
        }

        return void res.status(500).json({ error: 'Internal server error.' });
    }
}

export async function loanBook(req: Request, res: Response): Promise<void> {
    try {
        const bookId: Types.ObjectId = new Types.ObjectId(req.params.bookId as string);
        const userId: Types.ObjectId = new Types.ObjectId(req.body.userId as string);

        await BookService.loanBook(bookId, userId);

        res.status(201).json({ message: 'Book loaned/unloaned successfully' });
    } catch (error) {
        if (error instanceof Error) {
            if (error.cause === "emptyBookQueryResult") {
                return void res.status(404).json({ error: "Given book not found." }); 
            } else if (error.cause === "alreadyLoaned") {
                return void res.status(400).json({ error: "Given book is already loaned." }); 
            } else if (error.cause === "emptyUserQueryResult") {
                return void res.status(404).json({ error: "Given user not found." }); 
            } else if (error.cause === "failedBookUpdate") {
                return void res.status(500).json({ error: "A failure occurred while updating the book." }); 
            }

            return void res.status(500).json({ error: error.message });
        }

        return void res.status(500).json({ error: 'Internal server error.' });
    }
}

export async function unloanBook(req: Request, res: Response): Promise<void> {
    try {
        const bookId = new Types.ObjectId(req.params.bookId);
        const userId = new Types.ObjectId(req.body.userId);

        await BookService.unloanBook(bookId, userId);

        res.status(201).json({ message: 'Book unloaned successfully' });
    } catch (error) {
        if (error instanceof Error) {
            if (error.cause === "incompatibleBookState") {
                return void res.status(409).json({ error: "The book is already not loaned." });
            } else if (error.cause === "incorrectGivenUser") {
                return void res.status(400).json({ error: "Given user can't unloan this book since the book is loaned by someone else." });
            }

            return void res.status(500).json({ error: error.message });
        }

        return void res.status(500).json({ error: 'Internal server error.' });
    }
}

export async function getBookById(req: Request, res: Response): Promise<void> {
    try {
        const bookId = new Types.ObjectId(req.params.id);

        const book = await BookService.getBookById(bookId);

        res.send(200).json(book);
    } catch (error) {
        if (error instanceof Error) {
            if (error.cause === "emptyQueryResult") {
                return void res.status(404).json({ error: "Book with the given id doesn't exist." });
            }

            return void res.status(500).json({ error: error.message });
        }
    
        return void res.status(500).json({ error: 'Internal server error.' });
    }
}

export async function removeBookById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        
        await BookService.removeBookById(id);
        
        res.json({ message: 'Book removed successfully' });
    } catch (error) {
        if (error instanceof Error) {
            if (error.cause === "unsuccessfulDeletion") {
                return void res.status(500).json({ error: "The book to delete wasn't found in the database." });
            }

            return void res.status(500).json({ error: error.message });
        }
         
        return void res.status(500).json({ error: 'Internal server error.' });
    }
}

export async function updateBook(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const updatedBookData: Partial<IBook> = req.body;
        
        const updatedBook = await BookService.updateBook(id, updatedBookData);
        res.json(updatedBook);
    } catch (error) {
        if (error instanceof Error) {
            if (error.cause === "unsuccessfulUpdateQuery") {
                return void res.status(500).json({ error: "Book couldn't get updated." });
            }

            return void res.status(500).json({ error: error.message });
        }
         
        return void res.status(500).json({ error: 'Internal server error.' });
    }
}

export async function searchBooks(req: Request, res: Response): Promise<void> {
    try {
        const query = req.params.query; 
        const results = await BookService.searchBooks(query);
      
        res.json(results);
    } catch (error) {
        if (error instanceof Error) {
            if (error.cause === "missingQueryParameter") {
                return void res.status(400).json({ error: "The query parameter wasn't sent." });
            } else if (error.cause === "emptyQueryResult") {
                return void res.status(404).json({ error: "Given query didn't find any book documents." });
            }

            return void res.status(500).json({ error: error.message });
        }
         
        return void res.status(500).json({ error: 'Internal server error.' });
    }
}