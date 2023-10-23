import { Schema, model, Document, Types } from 'mongoose';

export interface IBook extends Document {
    bookName: string;
    publicationYear: number;
    publisher: string;
    language: string;
    author: string;
    aboutBook: string;
    isAvailable?: boolean;
    loaner?: Types.ObjectId;
    borrowedAt?: Date;
    url: string
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
    url: {
        type: String,
        required: true
    }
});

bookSchema.methods.loan = async function(userId: Types.ObjectId): Promise<void> {
    if (!this.isAvailable) {
        throw new Error('Book is not available for loan');
    }
    this.isAvailable = false;
    this.loaner = userId;
    this.borrowedAt = new Date();
    await this.save();
};

bookSchema.methods.return = async function(): Promise<void> {
    if (this.isAvailable) {
        throw new Error('Book is already available');
    }
    this.isAvailable = true;
    this.loaner = null; 
    this.borrowedAt = null;
    await this.save();
}


export default model<IBook>('Book', bookSchema);
