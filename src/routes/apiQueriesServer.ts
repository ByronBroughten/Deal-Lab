import express from "express";
import {
  apiEndpoints,
  ApiQueryName,
} from "../client/src/App/sharedWithServer/apiQueriesShared";
import { addSectionWare } from "./apiQueriesServer/addSection";
import { getSectionWare } from "./apiQueriesServer/getSection";
import { nextLoginWare } from "./apiQueriesServer/nextLogin";
import { nextRegisterWare } from "./apiQueriesServer/nextRegister";
import { updateSectionWare } from "./apiQueriesServer/updateSection";

const endpointWare: Record<ApiQueryName, any> = {
  nextRegister: nextRegisterWare,
  nextLogin: nextLoginWare,
  addSection: addSectionWare,
  updateSection: updateSectionWare,
  getSection: getSectionWare,
  // deleteSection
} as const;

const apiQueriesServer = express.Router();

apiQueriesServer.post(apiEndpoints.nextRegister.pathBit, ...nextRegisterWare);
apiQueriesServer.post(apiEndpoints.nextLogin.pathBit, ...nextLoginWare);
apiQueriesServer.post(apiEndpoints.addSection.pathBit, ...addSectionWare);
// implement addSection, then get automate construction of the omni router

export default apiQueriesServer;
