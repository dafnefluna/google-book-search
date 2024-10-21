import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';
import bookSchema, { IBook } from './Books.js';

// note: in starter it says Userdocument, i used Iuser to follow what I see in module 18.
// note: in starter code id is the unique id, i changed it to userId to differentiate it from _id
export interface IUser extends Document {
    userId: string;
    username: string;
    email: string;
    password: string;
    bookCount: number;
    savedBooks: IBook[];
    isCorrectPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    // set savedBooks to be an array of data that adheres to the bookSchema
    savedBooks: [bookSchema],
},
    // // set this to use virtual below
    // {
    //     toJSON: {
    //         virtuals: true,
    //         // if something fails think about getters (check activity 23)
    //         // toJSON: { getters: true },
    //         // toObject: { getters: true },
    //     },
    // }
);

// hash user password
userSchema.pre<IUser>('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `bookCount` with the number of saved books we have
userSchema.virtual('bookCount').get(function () {
    return this.savedBooks.length;
});

// this will change to users table
const User = model<IUser>('User', userSchema);

export default User;