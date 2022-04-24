import express from "express";
import { apiQueriesShared } from "../client/src/App/sharedWithServer/apiQueriesShared";
import { ApiQueryName } from "../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import { addSectionWare } from "./apiQueriesServer/addSection";
import { deleteSectionWare } from "./apiQueriesServer/deleteSection";
import { getSectionWare } from "./apiQueriesServer/getSection";
import { nextLoginWare } from "./apiQueriesServer/nextLogin";
import { nextRegisterWare } from "./apiQueriesServer/nextRegister";
import { replaceSectionArrWare } from "./apiQueriesServer/replaceSectionArr";
import { updateSectionWare } from "./apiQueriesServer/updateSection";
import { upgradeUserToProWare } from "./apiQueriesServer/upgradeUserToPro";

const endpointWare: Record<ApiQueryName, any> = {
  nextRegister: nextRegisterWare,
  nextLogin: nextLoginWare,
  addSection: addSectionWare,
  updateSection: updateSectionWare,
  getSection: getSectionWare,
  deleteSection: deleteSectionWare,
  replaceSectionArr: replaceSectionArrWare,
  upgradeUserToPro: upgradeUserToProWare,
} as const;

const apiQueriesServer = express.Router();

for (const [queryName, ware] of Obj.entries(endpointWare)) {
  apiQueriesServer.post(apiQueriesShared[queryName].pathBit, ...ware);
}

export default apiQueriesServer;
