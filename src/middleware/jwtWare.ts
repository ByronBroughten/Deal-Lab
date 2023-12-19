import config from "config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { constants } from "../client/src/sharedWithServer/Constants";

import { EstimatorPlanValues } from "../client/src/sharedWithServer/apiQueriesShared/EstimatorPlanValues";
import {
  ApiQueryName,
  QueryReq,
} from "../client/src/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { validateLabSubscription } from "../client/src/sharedWithServer/sectionVarbsConfig/StateValue/unionValues";
import { ValidationError } from "../client/src/sharedWithServer/utils/Error";
import { Obj } from "../client/src/sharedWithServer/utils/Obj";
import { Str } from "../client/src/sharedWithServer/utils/Str";
import { mathS } from "../client/src/sharedWithServer/utils/math";
import { StrictOmit } from "../client/src/sharedWithServer/utils/types";
import { ResStatusError } from "../useErrorHandling";

export interface UserJwt extends EstimatorPlanValues {
  userId: string;
  iat: number;
}

export type JwtReq<QN extends ApiQueryName> = WithJWT<QueryReq<QN>>;
export type WithJWT<T extends any> = T & JwtReqBase;
type JwtReqBase = {
  body: { userJwt: UserJwt };
};

export function userJwtWare(req: Request, _: Response, next: NextFunction) {
  const token = req.header(constants.tokenKey.userAuthData);
  if (!token) {
    throw new ResStatusError({
      errorMessage: `No userJwt present on req`,
      resMessage: "That didn't work. You are not properly logged in.",
      status: 401,
    });
  }
  const decoded = checkUserJwt(token);
  (req as JwtReq<any>).body.userJwt = decoded;
  next();
}

function checkUserJwt(token: any): UserJwt {
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  try {
    return validateUserJwt(decoded);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ResStatusError({
        errorMessage: error.message,
        resMessage: "You are not properly logged in.",
        status: 401,
      });
    } else {
      throw error;
    }
  }
}

export function validateUserJwt(value: any): UserJwt {
  const obj = Obj.validateObjToAny(value) as UserJwt;
  return {
    userId: Str.validate(obj.userId),
    labSubscriptionExp: mathS.validateNumber(obj.labSubscriptionExp),
    labSubscription: validateLabSubscription(obj.labSubscription),
    iat: mathS.validateNumber(obj.iat),
  };
}

export type UserJwtProps = StrictOmit<UserJwt, "iat">;
export function createUserJwt(userJwt: UserJwtProps): string {
  const privateKey: string = config.get("jwtPrivateKey");
  try {
    return jwt.sign(userJwt, privateKey);
  } catch (err) {
    throw new Error(
      `JWT failed to be made with userJwt ${JSON.stringify(
        userJwt
      )} and private key ${privateKey}.`
    );
  }
}
