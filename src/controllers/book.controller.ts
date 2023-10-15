import { Request, Response } from 'express';
import * as bookService from '../services/book.service';
import { Types } from 'mongoose';
import { IBook } from '../models/book.model'; 

export async function listBooks(req: Request, res: Response): Promise<void> {
    try {
        const books = await bookService.listBooks();
        res.json(books);
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
        res.json({ message: 'Book loaned successfully' });
    } catch (error:unknown) {
        res.status(400).json({ error: "Unkown Error" });
    }
}

