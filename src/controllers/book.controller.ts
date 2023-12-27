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
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}

export async function addBook(req: Request, res: Response): Promise<void> {
    try {
        const bookData: Partial<IBook> = req.body;
        const newBook = await BookService.addBook(bookData);
        
        res.status(201).json(newBook);
    } catch (error) { 
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}

export async function loanBook(req: Request, res: Response): Promise<void> {
    const bookId: Types.ObjectId = new Types.ObjectId(req.params.bookId as string);
    const userId: Types.ObjectId = new Types.ObjectId(req.body.userId as string);

    try {
        await BookService.loanBook(bookId, userId);

        res.status(201).json({ message: 'Book loaned/unloaned successfully' });
    } catch (error) {
        if (error instanceof Error) {
            if (error.cause === "failedBookUpdate") {
                res.status(500).json({ error: "A failure occurred while updating the book." }); 
            } else if (error.cause === "unavailabilityOfBook") {
                res.status(409).json({ error: "The book is currently unavailable to be loaned." }); 
            } else {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}

export async function unloanBook(req: Request, res: Response): Promise<void> {
    const bookId: Types.ObjectId = new Types.ObjectId(req.params.bookId as string);
    const userId: Types.ObjectId = new Types.ObjectId(req.body.userId as string);

    try {
        await BookService.unloanBook(bookId, userId);

        res.status(201).json({ message: 'Book unloaned successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}

export async function findById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    try {
        const book = await BookService.findById(id);
        if (book) {
            res.send(200).json(book);
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}

export async function removeById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    try {
        await BookService.removeById(id);
        res.json({ message: 'Book removed successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}

export async function updateBook(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const updatedBookData: Partial<IBook> = req.body;

    try {
        const updatedBook = await BookService.updateBook(id, updatedBookData);
        if (updatedBook) {
            res.json(updatedBook);
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}

export async function searchBooks(req: Request, res: Response): Promise<void> {
    try {
        const query = req.params.query; 
        const results = await BookService.searchBooks(query);
      
        res.json(results);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}