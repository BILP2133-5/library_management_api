import Book, { IBook } from '../models/book.model';
import User, { IUser } from '../models/user.model';
import { Types } from 'mongoose';
import { logActivity } from './log.service';

export async function listBooks(): Promise<IBook[]> {
    return Book.find().exec();
}

export async function addBook(bookData: Partial<IBook>): Promise<IBook> {
    const newBook = new Book(bookData);
    return newBook.save();
}

export async function loanBook(bookId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    try {
        const book = await Book.findById(bookId);
        const user = await User.findById(userId);

        if (!book || !user) {
            throw new Error('Book or user not found');
        }

        if (book.isAvailable) {
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
            } else {
                throw new Error('Book is not available for loan');
            } 
    } catch (error) {
        console.error('Error in loanBook:', error);
        throw new Error('Error in loanBook');
    }
}

export async function unloanBook(bookId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    try {
        const book = await Book.findById(bookId);
        const user = await User.findById(userId);

        if (!book || !user) {
            throw new Error('Book or user not found');
        }

        if (!book.isAvailable && book.loaner && book.loaner.equals(userId)) {
            book.isAvailable = true;
            book.loaner = null;
            book.borrowedAt = null;
            book.returnDate = null;

            user.borrowedBooks.pull(bookId);

            await book.save();
            await user.save();

            await logActivity(userId, 'Kitap Geri Verme', 'Kullanici kitabi geri verdi Kitap ID :' + bookId);
        } else {
            throw new Error('You are not the loaner of this book or the book is not currently on loan.');
        }
    } catch (error) {
        console.error('Error in returnBook:', error);
        throw new Error('Error in returnBook');
    }
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