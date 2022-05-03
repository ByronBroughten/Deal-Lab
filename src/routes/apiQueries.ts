import express from "express";
import { apiQueriesShared } from "../client/src/App/sharedWithServer/apiQueriesShared";
import { ApiQueryName } from "../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import { addSectionWare } from "./apiQueries/addSection";
import { deleteSectionWare } from "./apiQueries/deleteSection";
import { getSectionWare } from "./apiQueries/getSection";
import { nextLoginWare } from "./apiQueries/nextLogin";
import { nextRegisterWare } from "./apiQueries/nextRegister";
import { replaceSectionArrWare } from "./apiQueries/replaceSectionArr";
import { updateSectionWare } from "./apiQueries/updateSection";
import { upgradeUserToProWare } from "./apiQueries/upgradeUserToPro";

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
