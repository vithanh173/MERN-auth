import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { PORT, mongoDBURL } from "./config.js";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";

const app = express();
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
})

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    })

app.use("/server/user", userRouter);
app.use("/server/auth", authRouter);

//middleware
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Interal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});