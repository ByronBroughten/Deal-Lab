import express, { Request, Response } from "express";
import { crudRegisterNext } from "./userRoutes/registerNext";

const omniRouter = express.Router();
omniRouter[crudRegisterNext.operation](
  crudRegisterNext.routeBit,
  (req: Request, res: Response) => crudRegisterNext.receive(req, res)
);

// omniRouter[crudRegister.operation](
//   config.url.register.route,
//   (req: Request, res: Response) => crudRegister.fn(req, res)
// );
// omniRouter.post(config.url.sectionArr.route, (req, res) =>
//   sectionArrRoutes.post.receive(req, res)
// );
// omniRouter.post(config.url.login.route, login);

export default omniRouter;
