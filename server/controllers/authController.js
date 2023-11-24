import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import { JWT_SECRET } from "../config.js";

export const register = async (req, res, next) => {
    const { username, password, email, profile } = req.body;
    const hashPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, password: hashPassword, email, profile });
    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Wrong credentials"));
        }
        const token = jwt.sign({ id: validUser._id }, JWT_SECRET);
        const { password: hashedPassword, ...rest } = validUser._doc;
        const expiryDate = new Date(Date.now() + 3600000);
        res.cookie("token", token, { httpOnly: true, expires: expiryDate }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, JWT_SECRET);
            const { password: hashedPassword, ...rest } = user._doc;
            const expiryDate = new Date(Date.now() + 3600000);
            res.cookie("token", token, { httpOnly: true, expires: expiryDate }).status(200).json(rest);
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("") + Math.floor((Math.random() * 10000)).toString(),
                email: req.body.email,
                password: hashedPassword,
                profile: req.body.photo,
            });
            console.log(newUser);
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
            const { password: hashedPassword2, ...rest } = newUser._doc;
            const expiryDate = new Date(Date.now() + 3600000);
            res.cookie("token", token, {
                httpOnly: true,
                expires: expiryDate,
            }).status(200).json(rest);
        }

    } catch (error) {
        console.log(error);
    }
}

export const logout = (req, res, next) => {
    res.clearCookie("token").status(200).json("Logout success");
};