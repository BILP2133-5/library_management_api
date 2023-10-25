import { Schema, model, Document, Types } from 'mongoose';

export interface IBook extends Document {
    bookName: string;
    publicationYear: number;
    publisher: string;
    language: string;
    author: string;
    aboutBook: string;
    isAvailable?: boolean;
    loaner: Types.ObjectId | null;
    borrowedAt: Date | null;
    returnDate: Date | null;
    imageUrl: string;
}

const bookSchema = new Schema<IBook>({
    bookName: {
        type: String,
        required: true
    },
    publicationYear: {
        type: Number,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    aboutBook: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    loaner: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
    },
    borrowedAt: {
        type: Date,
        default: null
    },
    returnDate:{
        type: Date,
        default: null
    },
    imageUrl: {
        type: String
    }
});

export default model<IBook>('Book', bookSchema);
