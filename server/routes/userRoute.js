import express from "express";
import * as userController from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const userRouter = express.Router();

userRouter.get("/", userController.test);
userRouter.post("/update/:id", verifyToken, userController.updateUser);
userRouter.delete("/delete/:id", verifyToken, userController.deleteUser);


export default userRouter;