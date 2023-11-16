import { Request, Response } from 'express';
import * as bookService from '../services/book.service';
import { Types } from 'mongoose';
import { IBook } from '../models/book.model'; 

export async function listBooks(req: Request, res: Response): Promise<void> {
    try {
        const books = await bookService.listBooks();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function addBook(req: Request, res: Response): Promise<void> {
    const bookData: Partial<IBook> = req.body;

    try {
        const newBook = await bookService.addBook(bookData);
        res.status(201).json(newBook);
    } catch (error: unknown) { 
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unkown error' });
        }
    }
}

export async function loanBook(req: Request, res: Response): Promise<void> {
    const bookId: Types.ObjectId = new Types.ObjectId(req.params.bookId as string);
    const userId: Types.ObjectId = new Types.ObjectId(req.body.userId as string);
    try {
        await bookService.loanBook(bookId, userId);
        res.status(201).json({ message: 'Book loaned/unloaned successfully' });
    } catch (error:unknown) {
        res.status(400).json({ error: "Unkown Error" });
    }
}

export async function findById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    try {
        const book = await bookService.findById(id);
        if (book) {
            res.send(200).json(book);
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function removeById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    try {
        await bookService.removeById(id);
        res.json({ message: 'Book removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateBook(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const updatedBookData: Partial<IBook> = req.body;

    try {
        const updatedBook = await bookService.updateBook(id, updatedBookData);
        if (updatedBook) {
            res.json(updatedBook);
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function searchBooks(req: Request, res: Response): Promise<void> {
    const query = req.params.query; 
    try {
      const results = await bookService.searchBooks(query as string);
      console.log(results);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error while searching books' });
    }
}