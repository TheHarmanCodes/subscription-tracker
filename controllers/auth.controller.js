import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    ADMIN_BOOTSTRAP_SECRET,
    JWT_EXPIRES_IN,
    JWT_SECRET,
} from "../config/env.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Logic to create a new user
        // extracting name, email, password from the response we got from the submitted form
        const {
            name,
            email,
            password,
            role: requestedRole,
            adminSecret,
        } = req.body;

        if (!password || password.length < 8) {
            const error = new Error("Password must be at least 8 characters");
            error.statusCode = 400;
            throw error;
        }
        // check if user already exists
        // email is unique so we are finding with it
        const existingUser = await User.findOne({email});
        if (existingUser) {
            const error = new Error("User already exists.");
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const normalizedEmail = email.trim().toLowerCase();
        let role = "user";

        if (requestedRole === "admin") {
            const isValidAdminSecret =
                Boolean(ADMIN_BOOTSTRAP_SECRET) &&
                adminSecret === ADMIN_BOOTSTRAP_SECRET;

            if (!isValidAdminSecret) {
                const error = new Error("Admin signup is not allowed");
                error.statusCode = 403;
                throw error;
            }
            role = "admin";
        }

        const newUsers = await User.create(
            [{name, email: normalizedEmail, password: hashedPassword, role}],
            {session},
        );
        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        await session.commitTransaction();
        await session.endSession();
        res.status(201).json({
            success: true,
            message: "User successfully created!",
            data: {
                token,
                user: newUsers[0],
            },
        });
    } catch (error) {
        // handling atomic operations
        await session.abortTransaction();
        await session.endSession();
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email}).select("+password");
        if (!user) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        // Remove password before sending response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: "User successfully logged in!",
            data: {
                token,
                user: userResponse,
            },
        });
    } catch (error) {
        next(error);
    }
};

// In a stateless JWT flow, sign-out is handled on the client by discarding the token.
// This route is kept as a placeholder for future session, cookie, or refresh-token invalidation.
export const signOut = async (_req, _res, _next) => {
};
