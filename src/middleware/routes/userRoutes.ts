import express from "express";
import { register } from "./userRoutes/register";
import { login } from "./userRoutes/login";

const userRouter = express.Router();
userRouter.post("/register", register);
userRouter.post("/login", login);
export default userRouter;
