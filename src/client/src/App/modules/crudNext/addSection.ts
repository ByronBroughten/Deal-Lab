import { config } from "../../Constants";
import { NextReq, NextRes } from "../../sharedWithServer/apiQueriesShared";
import https from "../services/httpService";
import { generalValidators } from "./generalValidators";

export async function addSectionClientSide(
  reqObj: NextReq<"addSection">
): Promise<NextRes<"addSection"> | undefined> {
  const res = await https.post(
    "saving",
    config.apiEndpoints.addSection.path,
    reqObj.body
  );
  return generalValidators.dbId(res);
}
