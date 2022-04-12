import express from "express";
import { crudLoginNext } from "./omni/loginNext";
import { crudRegisterNext } from "./omni/registerNext";

const omniRouter = express.Router();
omniRouter[crudRegisterNext.operation](crudRegisterNext.routeBit, (req, res) =>
  crudRegisterNext.receive(req, res)
);
omniRouter[crudLoginNext.operation](crudLoginNext.routeBit, (req, res) =>
  crudLoginNext.receive(req, res)
);
// Next try postSection

export default omniRouter;
