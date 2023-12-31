import { Types } from 'mongoose';

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

export function deleteBookById(bookId: Types.ObjectId): Promise<IBookDocument | null> {
    return Book.findByIdAndRemove(bookId).exec(); // TODO: update the mongoose to v8 and replace findByIdAndRemove with findByIdAndDelete
}

export function findBookByIdAndUpdate(bookId: Types.ObjectId, updatedBookData: Partial<IBook>): Promise<IBookDocument | null> {
    return Book.findByIdAndUpdate(bookId, updatedBookData, { new: true }).exec();
}