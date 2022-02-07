import express from "express";
import cors from "cors";
import arrRouter, {
  dbEntryRoutePath,
} from "../middleware/routes/dbEntryRoutes";
import userRouter, { userRoutesPath } from "../middleware/routes/userRoutes";
import { authTokenKey } from "../client/src/App/sharedWithServer/User/crudTypes";

export default function routes(app: express.Application) {
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://ultimate-property-analyzer.herokuapp.com",
      ],
      credentials: true,
      exposedHeaders: [authTokenKey],
    })
  );
  app.use(express.json()); // parses body into a JSON object
  app.use(dbEntryRoutePath, arrRouter);
  app.use(userRoutesPath, userRouter);
  // app.use("/", home);
}
