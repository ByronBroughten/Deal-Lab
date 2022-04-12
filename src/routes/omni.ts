import express from "express";
import { config } from "./../client/src/App/Constants";
import { nextLoginHandlers } from "./omni/nextLogin";
import { nextRegisterHandlers } from "./omni/nextRegister";

const endpoints = {
  nextRegister: nextRegisterHandlers,
  nextLogin: nextLoginHandlers,
} as const;

const omniRouter = express.Router();

omniRouter.post(config.apiEndpoints.nextRegister.bit, ...nextRegisterHandlers);
omniRouter.post(config.apiEndpoints.nextLogin.bit, ...nextLoginHandlers);
// post then get then automate the omni router

export default omniRouter;
