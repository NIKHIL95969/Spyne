import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/jsonWebToken.js";
import { TryCatch } from "../middlewares/error.js";

// Register User
export const registerUser = TryCatch(async (req, res, next) => {
    
    console.log(req.body);

    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password
    });

    sendToken(user, 201, res);
});

// Login User
export const loginUser = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;
       
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isMatched = await user.comparePassword(password);

    if (!isMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});

// Logout User
export const logoutUser = TryCatch(async (req, res, next) => {
    res.cookie('SpyneToken', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true
    });
});
