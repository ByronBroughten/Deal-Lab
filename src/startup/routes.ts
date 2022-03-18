import express from "express";
import cors from "cors";
import sectionRouter, {
  sectionRoutes,
} from "../middleware/routes/sectionRoutes";
import userRouter from "../middleware/routes/userRoutes";
import { authTokenKey } from "../client/src/App/sharedWithServer/User/crudTypes";
import { config } from "../client/src/App/Constants";
import sectionArrRouter, {
  sectionArrRoutes,
} from "../middleware/routes/sectionArrRoutes";

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
  app.use(sectionArrRoutes.route, sectionArrRouter);
  app.use(sectionRoutes.route, sectionRouter);
  app.use(config.url.user.route, userRouter);
}
