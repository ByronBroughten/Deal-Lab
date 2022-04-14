import express from "express";
import { apiEndpoints } from "../client/src/App/sharedWithServer/apiQueriesShared";
import { addSectionWare } from "./omni/addSection";
import { nextLoginWare } from "./omni/nextLogin";
import { nextRegisterWare } from "./omni/nextRegister";

const endpointWare = {
  nextRegister: nextRegisterWare,
  nextLogin: nextLoginWare,
  addSection: addSectionWare,
} as const;

const omniRouter = express.Router();

omniRouter.post(apiEndpoints.nextRegister.pathBit, ...nextRegisterWare);
omniRouter.post(apiEndpoints.nextLogin.pathBit, ...nextLoginWare);
omniRouter.post(apiEndpoints.addSection.pathBit, ...addSectionWare);
// implement addSection, then get automate construction of the omni router

export default omniRouter;
