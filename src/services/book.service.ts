import { Types } from 'mongoose';

import Book, { IBook } from '../models/book.model';
import User from '../models/user.model';
import { logActivity } from './log.service';

import * as BookDataAccess from '../data-access/book.data-access';
import * as UserDataAccess from '../data-access/user.data-access';

export async function listBooks(): Promise<IBook[]> {
    const allBooks: Awaited<ReturnType<typeof BookDataAccess.getAllBooks>> = await BookDataAccess.getAllBooks();

    return allBooks;
}

export async function addBook(bookData: Partial<IBook>): Promise<IBook> {
    const newBook: Awaited<ReturnType<typeof BookDataAccess.addNewBook>> = await BookDataAccess.addNewBook(bookData);

    return newBook;
}

export async function loanBook(bookId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    const book: Awaited<ReturnType<typeof BookDataAccess.getBookById>> = await BookDataAccess.getBookById(bookId);
    if (book === null) {
        throw new Error('Book not found.', { cause: 'emptyBookQueryResult' });
    } else if (book.isAvailable === false) {
        throw new Error('Book is not available to be loaned.', { cause: 'alreadyLoaned' });
    }

    const user: Awaited<ReturnType<typeof UserDataAccess.getUserById>> = await UserDataAccess.getUserById(userId);
    if (user === null) {
        throw new Error('User not found.', { cause: 'emptyUserQueryResult' });
    }

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
}

export async function unloanBook(bookId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    const book: Awaited<ReturnType<typeof BookDataAccess.getBookById>> = await BookDataAccess.getBookById(bookId);
    if (book === null) {
        throw new Error('Book not found.', { cause: 'Empty query result.' });
    } else if (book.isAvailable) {
        throw new Error('The book is not currently on loan.', { cause: 'incompatibleBookState' });
    }

    const user: Awaited<ReturnType<typeof UserDataAccess.getUserById>> = await UserDataAccess.getUserById(userId);
    if (user === null) {
        throw new Error('User not found.', { cause: 'Empty query result.' });
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
    const bookDocument: Awaited<ReturnType<typeof BookDataAccess.getBookById>> = await BookDataAccess.getBookById(bookId);
    if (bookDocument === null) {
        throw new Error("Book with the given id doesn't exist.", { cause: "emptyQueryResult" });
    }

    return bookDocument
}

export async function removeBookById(bookId: string): Promise<void> {
    const deletedBookDocument: Awaited<ReturnType<typeof BookDataAccess.deleteBookById>> = await BookDataAccess.deleteBookById(new Types.ObjectId(bookId));
    if (deletedBookDocument === null) {
        throw new Error("The book to delete wasn't found in the database.", { cause: "unsuccessfulDeletion" })
    }
}

export async function updateBook(id: string, updatedBookData: Partial<IBook>): Promise<IBook | null> {
    const updatedBook: Awaited<ReturnType<typeof BookDataAccess.findBookByIdAndUpdate>> = await BookDataAccess.findBookByIdAndUpdate(new Types.ObjectId(id), updatedBookData);
    if (updatedBook === null) {
        throw new Error("Book couldn't get updated.", { cause: "unsuccessfulUpdateQuery" })
    }

    return updatedBook;
}

export async function searchBooks(query: string): Promise<IBook[] | null> {
    if (!query) {
        throw new Error('Search query is missing.', { cause: "missingQueryParameter" });
    }

    const foundBooks = await Book.find({
        $or: [
            { bookName: { $regex: new RegExp(query, 'i') } },
            { author: { $regex: new RegExp(query, 'i') } }
        ]
    });
    if (foundBooks === null || foundBooks.length === 0) {
        throw new Error("Couldn't find books.", { cause: "emptyQueryResult" })
    }
    
    return foundBooks;
}