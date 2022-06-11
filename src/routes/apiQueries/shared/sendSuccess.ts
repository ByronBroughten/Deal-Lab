import { Response } from "express";
import {
  ApiQueryName,
  NextRes,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";

export function sendSuccess<QN extends ApiQueryName>(
  res: Response,
  _queryName: QN,
  resObj: NextRes<QN>
) {
  const { headers } = resObj as any;
  res.header(headers).status(200).send(resObj.data);
}
// I'll want to test the setterSection queries

// to test the actors, I'll basically create a fake axios api
// and as long as the req validation passes, it'll return
// the res object.
