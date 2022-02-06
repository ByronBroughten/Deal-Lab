import { Request } from "express";
import { UserJwt } from "../../routes/userRoutes/login";

declare module "express-serve-static-core" {
  interface Request extends Request {
    user: UserJwt;
  }
}
