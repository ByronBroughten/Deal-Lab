import config from "config";
import jwt from "jsonwebtoken";
import { AnalyzerPlanValues } from "../../../../../client/src/App/sharedWithServer/apiQueriesShared/AnalyzerPlanValues";
import { validateLabSubscription } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { mathS } from "../../../../../client/src/App/sharedWithServer/utils/math";
import { Obj } from "../../../../../client/src/App/sharedWithServer/utils/Obj";
import { Str } from "../../../../../client/src/App/sharedWithServer/utils/Str";
import { StrictOmit } from "../../../../../client/src/App/sharedWithServer/utils/types";
import { ResStatusError } from "../../../../../utils/resError";
import { ValidationError } from "./../../../../../client/src/App/sharedWithServer/utils/Error";

export interface UserInfoJwt extends AnalyzerPlanValues {
  userId: string;
  iat: number;
}

export type UserJwtProps = StrictOmit<UserInfoJwt, "iat">;
export function createUserInfoToken(userJwt: UserJwtProps): string {
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

export function validateUserInfoJwt(value: any): UserInfoJwt {
  const obj = Obj.validateObjToAny(value) as UserInfoJwt;
  return {
    userId: Str.validate(obj.userId),
    labSubscriptionExp: mathS.validateNumber(obj.labSubscriptionExp),
    labSubscription: validateLabSubscription(obj.labSubscription),
    iat: mathS.validateNumber(obj.iat),
  };
}
export function isUserJwt(value: any): value is UserInfoJwt {
  try {
    validateUserInfoJwt(value);
    return true;
  } catch (err) {
    if (err instanceof ValidationError) {
      return false;
    } else {
      throw err;
    }
  }
}

export function checkUserAuthToken(token: any): UserInfoJwt {
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  if (isUserJwt(decoded)) return decoded;
  else
    throw new ResStatusError({
      errorMessage: "Access denied. Invalid token provided.",
      resMessage: "You are not logged in.",
      status: 401,
    });
}
