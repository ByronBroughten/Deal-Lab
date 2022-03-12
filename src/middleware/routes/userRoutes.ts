import express from "express";
import { register } from "./userRoutes/register";
import { login } from "./userRoutes/login";
import { config } from "../../client/src/App/Constants";

const userRouter = express.Router();
userRouter.post(config.url.register.bit, register);
userRouter.post(config.url.login.bit, login);
export default userRouter;
