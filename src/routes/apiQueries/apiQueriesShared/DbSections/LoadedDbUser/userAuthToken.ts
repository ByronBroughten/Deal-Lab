import config from "config";
import jwt from "jsonwebtoken";
import { isObject } from "lodash";
import { AnalyzerPlanValues } from "../../../../../client/src/App/sharedWithServer/apiQueriesShared/AnalyzerPlanValues";
import { isLabSubscription } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/values/StateValue/unionValues";

import { StrictOmit } from "../../../../../client/src/App/sharedWithServer/utils/types";
import { ResStatusError } from "../../../../../utils/resError";

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

export function isUserJwt(value: any): value is UserInfoJwt {
  return (
    isObject(value) && Object.keys(value).length === 4 && hasTokenProps(value)
  );
}

function hasTokenProps(value: any) {
  return (
    "userId" in value &&
    "labSubscription" in value &&
    "labSubscriptionExp" in value &&
    "iat" in value &&
    typeof value.userId === "string" &&
    typeof value.iat === "number" &&
    typeof value.labSubscriptionExp === "number" &&
    isLabSubscription(value.labSubscription)
  );
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
