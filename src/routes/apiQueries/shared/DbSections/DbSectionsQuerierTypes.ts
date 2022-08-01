import mongoose, { Document } from "mongoose";
import { ResStatusError } from "../../../../resErrorUtils";
import { DbSectionsModelCore, modelPath } from "../../../DbSectionsModel";

export const queryOptions = {
  new: true,
  lean: true,
  useFindAndModify: false,
} as const;

export class UserNotFoundError extends ResStatusError {}
export class SectionPackNotFoundError extends ResStatusError {}
export interface DbSectionsRaw extends DbSectionsModelCore, Document<any, any> {
  _id: mongoose.Types.ObjectId;
}

export const dbSectionsFilters = {
  userId(userId: string) {
    return { _id: userId } as const;
  },
  customerId(customerId: string) {
    const path = modelPath.firstSectionVarb({
      storeName: "stripeInfoPrivate",
      sectionName: "stripeInfoPrivate" as "stripeInfoPrivate",
      varbName: "customerId",
    });
    return { [path]: customerId };
  },
  email(email: string) {
    const path = modelPath.firstSectionVarb({
      storeName: "userInfo",
      sectionName: "userInfo",
      varbName: "email",
    });
    return { [path]: email } as const;
  },
};
