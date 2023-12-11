import { NextFunction, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import { Str } from "../client/src/App/sharedWithServer/utils/Str";
import { ResStatusError } from "../useErrorHandling";

export function getAuthWare() {
  return [verifySession(), getAuthData];
}

async function getAuthData(
  req: SessionRequest,
  _: Response,
  next: NextFunction
) {
  const session = req.session;
  if (!session) {
    throw new ResStatusError({
      errorMessage: `No session present on req`,
      resMessage: "That didn't work. You are not properly logged in.",
      status: 401,
    });
  }
  const authData: AuthData = { id: session.getUserId() };
  req.body.auth = authData;
  next();
}

export type Authed<T extends any> = T & AuthedReqBase;
type AuthedReqBase = {
  body: {
    auth: AuthData;
  };
};
type AuthData = {
  id: string;
};

export function validateAuthData(value: any): AuthData {
  const auth = Obj.validateObjToAny(value) as AuthData;
  return { id: Str.validate(auth.id) };
}

export function validateEmptyAuthReq(req: Authed<{}>): Authed<{}> {
  const { auth } = req.body;
  return {
    body: {
      auth: validateAuthData(auth),
    },
  };
}
