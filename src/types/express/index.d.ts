import { UserInfoJwt } from "../../routes/apiQueries/shared/DbSections/LoadedDbUser/userAuthToken";

declare module "express-serve-static-core" {
  interface Request extends Request {
    userJwt: UserInfoJwt;
  }
}
