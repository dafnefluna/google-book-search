import IBook from "./Books.js";

export default interface IUser {
    userId: string;
    username: string;
    email: string;
    password: string;
    bookCount: number;
    savedBooks: IBook[];
    isCorrectPassword(password: string): Promise<boolean>;
}