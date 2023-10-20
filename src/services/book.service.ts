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
        if (book.loaner && book.loaner.equals(userId)) {
            book.isAvailable = true;
            book.loaner = null;
            book.borrowedAt = null;
        } else {
            throw new Error('Book is not available for loan');
        }
    } else {
        book.isAvailable = false;
        book.loaner = userId;
        book.borrowedAt = new Date();
    }

    await book.save();
}

export async function findById(id: string): Promise<IBook | null> {
    try {
        return await Book.findById(id);
    } catch (error) {
        throw new Error('Error finding the book by ID');
    }
}

export async function removeById(id: string): Promise<void> {
    try {
        await Book.findByIdAndRemove(id);
    } catch (error) {
        throw new Error('Error removing the book by ID');
    }
}

export async function updateBook(id: string, updatedBookData: Partial<IBook>): Promise<IBook | null> {
    try {
        return await Book.findByIdAndUpdate(id, updatedBookData, { new: true });
    } catch (error) {
        throw new Error('Error updating the book');
    }
}