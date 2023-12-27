import { Types } from 'mongoose';

import Book, { IBook } from '../models/book.model';
import User from '../models/user.model';
import { logActivity } from './log.service';

import * as BookDataAccess from '../data-access/book.data-access';
import * as UserDataAccess from '../data-access/user.data-access';

export async function listBooks(): Promise<IBook[]> {
    return await BookDataAccess.getAllBooks();
}

export async function addBook(bookData: Partial<IBook>): Promise<IBook> {
    return await BookDataAccess.addNewBook(bookData);
}

export async function loanBook(bookId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    const book: Awaited<ReturnType<typeof BookDataAccess.getBookById>> = await BookDataAccess.getBookById(bookId);
    if (book === null) {
        throw new Error('Book not found.', { cause: 'Empty query result.' });
    }

    const user: Awaited<ReturnType<typeof UserDataAccess.getUserById>> = await UserDataAccess.getUserById(userId);
    if (user === null) {
        throw new Error('User not found.', { cause: 'Empty query result.' });
    }

    if (book.isAvailable) {
        try {
            book.isAvailable = false;
            book.loaner = userId;
            book.borrowedAt = new Date();
    
            const returnDate = new Date(book.borrowedAt);
            returnDate.setDate(returnDate.getDate() + 15);
            book.returnDate = returnDate;
    
            user.borrowedBooks.push(bookId);
    
            await book.save();
            await user.save();
    
            await logActivity(userId, 'Kitap Odunc Alma', 'Kullanici kitap odunc aldi Kitap ID :' + bookId);
        } catch (error) {
            throw new Error("Couldn't change the book to loaned state.", { cause: "failedBookUpdate" })
        }

    } else {
        throw new Error('Book is not available to loan.', { cause: 'unavailabilityOfBook' });
    } 
}

export async function unloanBook(bookId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    const book: Awaited<ReturnType<typeof BookDataAccess.getBookById>> = await BookDataAccess.getBookById(bookId);
    if (book === null) {
        throw new Error('Book not found.', { cause: 'Empty query result.' });
    }

    const user: Awaited<ReturnType<typeof UserDataAccess.getUserById>> = await UserDataAccess.getUserById(userId);
    if (user === null) {
        throw new Error('User not found.', { cause: 'Empty query result.' });
    }

    if (book.isAvailable) {
        throw new Error('The book is not currently on loan.', { cause: 'incompatibleBookState' });
    } else if (book?.loaner?.equals(userId)) {
        throw new Error('You are not the loaner of this book.', { cause: 'incorrectGivenUser' });
    }
    try {
        book.isAvailable = true;
        book.loaner = null;
        book.borrowedAt = null;
        book.returnDate = null;

        user.borrowedBooks.pull(bookId);

        await book.save();
        await user.save();

        await logActivity(userId, 'Kitap Geri Verme', 'Kullanici kitabi geri verdi Kitap ID :' + bookId);
    } catch (error) {
        throw new Error("Couldn't change the book to unloaned state.", { cause: 'failedBookUpdate' });
    }
}


export async function getBookById(bookId: Types.ObjectId): Promise<IBook | null> {
    const bookDocument = await BookDataAccess.getBookById(bookId);
    if (bookDocument === null) {
        throw new Error("Book with the given id doesn't exist.", { cause: "emptyQueryResult" });
    }

    return bookDocument
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

export async function searchBooks(query: string): Promise<IBook[] | null> {
    if (!query) {
        throw new Error('Search query is missing.');
    }

    try {
        const results = await Book.find({
            $or: [
                { bookName: { $regex: new RegExp(query, 'i') } },
                { author: { $regex: new RegExp(query, 'i') } }
            ]
        });
        
        if (results === null || results.length === 0) {
            return null;
        }
        
        return results;
    } catch (error) {
        throw new Error('Error searching the books: ');
    }
}