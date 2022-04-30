import { Response } from "express";
import {
  ApiQueryName,
  NextRes,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";

export function sendSuccess<QN extends ApiQueryName>(
  res: Response,
  _queryName: QN,
  resObj: NextRes<QN>
) {
  const { headers } = resObj as any;
  res.header(headers).status(200).send(resObj.data);
}
