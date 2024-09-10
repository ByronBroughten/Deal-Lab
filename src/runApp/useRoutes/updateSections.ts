import { Request, Response } from "express";
import { DbUserService } from "../../DbUserService";
import { getAuthWare } from "./middleware/authWare";
import { userJwtWare } from "./middleware/jwtWare";
import { sendSuccess } from "./routesShared/sendSuccess";
import { validateUpdateSectionsReq } from "./updateSections/updateSections";

export const updateSectionsWare = [
  getAuthWare(),
  userJwtWare,
  updateSections,
] as const;

export async function updateSections(req: Request, res: Response) {
  const { changes, auth, userJwt } = validateUpdateSectionsReq(req).body;

  const dbUser = await DbUserService.initBy("authId", auth.id);
  for (const action of changes) {
    switch (action.changeName) {
      case "add": {
        await dbUser.addSection({
          storeName: action.storeName,
          labSubscription: userJwt.labSubscription,
          sectionPack: action.sectionPack,
        });
        break;
      }
      case "update": {
        await dbUser.updateSectionPack({
          dbStoreName: action.storeName,
          sectionPack: action.sectionPack,
        });
        break;
      }
      case "remove": {
        await dbUser.deleteSectionPack({
          dbStoreName: action.storeName,
          dbId: action.dbId,
        });
      }
    }
  }

  sendSuccess(res, "updateSections", { data: { success: true } });
}
