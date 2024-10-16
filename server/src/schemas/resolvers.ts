// todo: import models
import User, { IUser } from "../models/Users.js"
import { IBook } from "../models/Books.js"
import { signToken, AuthenticationError } from '../utils/auth.js';

// Define or import the Context type
// interface Context {
//     user?: {
//         _id: string;
//     };
// }

// Define the Auth type
interface Auth {
    token: string;
    user: IUser;
}

// todo: create resolvers for the Query and Mutation of data, export default resolvers

const resolvers = {
    Query: {
        user: async (): Promise<IUser[] | null> => {
            return User.find({});
            // if something is wrong remove .lean. copilot was suggesting and Im testing it 10/16
        },
        singleUser: async (_parent: any, { _id }: { _id: string }): Promise<IUser | null> => {
            const params = _id ? { _id } : {};
            return User.findOne(params);
        },
        me: async (_parent: any, _args: any, context: any): Promise<IUser | null> => {
            if (!context.user) {
                throw new AuthenticationError('Not Authenticated');
            }
            return await User.findOne({ _id: context.user._id });
        },
    },

    Mutation: {
        addUser: async (_parent: any, args: any): Promise<IUser | null> => {
            const user = await User.create(args);
            return user;
        },
        login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<Auth> => {
            // Find a profile by email
            const user = await User.findOne({ email });

            if (!user) {
                // If profile with provided email doesn't exist, throw an authentication error
                throw new AuthenticationError('No user found with this email address');
            }
            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                // If password is incorrect, throw an authentication error
                throw new AuthenticationError('Not Authenticated: Incorrect Password');
            }

            // Sign a JWT token for the authenticated profile
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        // if issues try userId 10/16
        saveBook: async (_parent: any, { userId, input }: { userId: string, input: IBook }): Promise<IUser | null> => {
            return User.findOneAndUpdate(
                {_id: userId },
                { $addToSet: { savedBooks: input } },
                { new: true, runValidators: true }
            );
        },
        removeBook: async (_parent: any, { userId, bookId }: { userId: string, bookId: string }): Promise<IUser | null> => {
            return User.findOneAndUpdate(
                { _id: userId },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
        }
    }
}

export default resolvers;