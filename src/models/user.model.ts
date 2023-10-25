import mongoose, { Schema, Document,Types, Model } from "mongoose";
import bcrypt from "bcrypt";
import Book, { IBook } from "./book.model";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  borrowedBooks: Types.Array<IBook["_id"]>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  borrowedBooks: [
    { type: Schema.Types.ObjectId, ref: "Book" }, 
  ],
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this;
  return bcrypt.compare(candidatePassword, user.password);
};

export default mongoose.model<IUser>("User", UserSchema);
