import express, { Request, Response } from "express";
import { config } from "../client/src/App/Constants";
import { login } from "./userRoutes/login";
import { crudRegister } from "./userRoutes/register";

const userRouter = express.Router();
// userRouter[crudRegisterNext.operation](
//   config.url.nextRegister.bit,
//   (req: Request, res: Response) => crudRegisterNext.fn(req, res)
// );
userRouter[crudRegister.operation](
  config.url.register.bit,
  (req: Request, res: Response) => crudRegister.fn(req, res)
);
userRouter.post(config.url.login.bit, login);
export default userRouter;
