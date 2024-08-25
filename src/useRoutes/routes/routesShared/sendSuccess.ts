import { Response } from "express";
import { QueryRes } from "../../../client/src/sharedWithServer/ApiQueries";
import { ApiQueryName } from "../../../client/src/sharedWithServer/Constants/queryPaths";

export function sendSuccess<QN extends ApiQueryName>(
  res: Response,
  _queryName: QN,
  resObj: QueryRes<QN>
) {
  const { headers } = resObj as any;
  res.header(headers).status(200).send(resObj.data);
}
