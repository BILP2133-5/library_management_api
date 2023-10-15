import Book, { IBook } from '../models/book.model';
import { Types } from 'mongoose';

export async function listBooks(): Promise<IBook[]> {
    return Book.find().exec();
}

export async function addBook(bookData: Partial<IBook>): Promise<IBook> {
    const newBook = new Book(bookData);
    return newBook.save();
}

export async function loanBook(bookId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    const book = await Book.findById(bookId);

    if (!book) {
        throw new Error('Book not found');
    }

    if (!book.isAvailable) {
        throw new Error('Book is not available for loan');
    }

    book.isAvailable = false;
    book.loaner = userId;
    book.borrowedAt = new Date();
    await book.save();
}