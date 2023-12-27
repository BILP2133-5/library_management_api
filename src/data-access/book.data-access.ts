import { Types, Document, ObjectId } from 'mongoose';

import Book, { IBook, IBookDocument } from '../models/book.model';

export function getAllBooks(): Promise<IBookDocument[]> {
    return Book.find().exec();
}

export function addNewBook(bookData: Partial<IBook>): Promise<IBookDocument> {
    return new Book(bookData).save();
}

export function getBookById(bookId: Types.ObjectId): Promise<IBookDocument | null> {
    return Book.findById(bookId).exec();
}