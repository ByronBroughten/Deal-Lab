import config from "config";
import jwt from "jsonwebtoken";
import { isObject } from "lodash";
import { ResStatusError } from "../../../../../resErrorUtils";

export type UserJwt = { _id: string };
export function makeUserAuthToken(userId: string) {
  const userJwt: UserJwt = { _id: userId };
  const privateKey: string = config.get("jwtPrivateKey");
  try {
    return jwt.sign(userJwt, privateKey);
  } catch (err) {
    throw new Error(
      `JWT failed to be made with userId ${userId} and private key ${privateKey}.`
    );
  }
}

export function checkUserAuthToken(token: any): UserJwt {
  const decoded = decodeUserAuthToken(token);
  if (decoded) return decoded;
  else throw new ResStatusError({
    errorMessage: "Access denied. Invalid token provided.",
    resMessage: "You are not logged in.",
    status: 401
  })
}

function decodeUserAuthToken(token: any): UserJwt | null {
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  if (isUserJwt(decoded)) return decoded;
  else return null;
}
function tokenHasCorrectProps(value: any) {
  return (
    "_id" in value &&
    "iat" in value &&
    typeof value._id === "string" &&
    typeof value.iat === "number"
  );
}
function isUserJwt(value: any): value is UserJwt {
  return (
    isObject(value) &&
    Object.keys(value).length === 2 &&
    tokenHasCorrectProps(value)
  );
}