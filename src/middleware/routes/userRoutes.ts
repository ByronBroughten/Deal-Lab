import express, { Request, Response } from "express";
import { crudRegister } from "./userRoutes/register";
import { login } from "./userRoutes/login";
import { config } from "../../client/src/App/Constants";

const userRouter = express.Router();
userRouter[crudRegister.operation](
  config.url.register.bit,
  (req: Request, res: Response) => crudRegister.fn(req, res)
);
userRouter.post(config.url.login.bit, login);
export default userRouter;
