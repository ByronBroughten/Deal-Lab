import { Request, Response } from "express";
import { createNewSession } from "supertokens-node/recipe/session";
import { QueryReq } from "../../../client/src/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { sendSuccess } from "../routesShared/sendSuccess";

export const makeSessionWare = [makeSession];
async function makeSession(req: Request, res: Response) {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("This route is only for tests");
  }

  const {
    body: { authId },
  } = validateMakeSessionReq(req);
  await createNewSession(res, authId);
  sendSuccess(res, "makeSession", { data: {} });
}

function validateMakeSessionReq(req: Request): QueryReq<"makeSession"> {
  const { authId } = (req as QueryReq<"makeSession">).body;
  if (typeof authId === "string") return { body: { authId } };
  else throw new Error("Valid authId not provided");
}
