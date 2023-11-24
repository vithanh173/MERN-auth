import express from "express";
import * as authController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/google", authController.google);
authRouter.get("/logout", authController.logout);


export default authRouter;