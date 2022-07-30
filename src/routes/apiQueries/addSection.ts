import { Request, Response } from "express";
import { constants } from "../../client/src/App/Constants";
import { UserPlan } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSections";
import { DbPack } from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbSectionPack";
import {
  DbStoreInfo,
  SectionQueryName,
} from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { userAuthWare } from "../../middleware/authWare";
import { ResStatusError } from "../../resErrorUtils";
import { DbSectionsQuerier } from "./shared/DbSections/DbSectionsQuerier";
import { SectionPackNotFoundError } from "./shared/DbSections/DbSectionsQuerierTypes";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import { sendSuccess } from "./shared/sendSuccess";
import { validateSectionPackReq } from "./shared/validateSectionPackReq";

export const addSectionWare = [userAuthWare, addSectionServerSide] as const;
async function addSectionServerSide(req: Request, res: Response) {
  const {
    dbStoreName,
    sectionPack,
    userJwt: { userId, subscriptionPlan },
  } = validateSectionPackReq(req).body;
  await validateAuth({
    userId,
    dbStoreName,
    subscriptionPlan,
  });
  await checkThatSectionPackIsNotThere({
    dbStoreName,
    dbId: sectionPack.dbId,
    userId,
  });
  await findUserByIdAndUpdate({
    userId,
    queryParameters: makePushParameters({
      dbStoreName,
      sectionPack,
    }),
  });
  sendSuccess(res, "addSection", { data: { dbId: sectionPack.dbId } });
}

type ValidateAuthProps = {
  subscriptionPlan: UserPlan;
  dbStoreName: SectionQueryName;
  userId: string;
};
async function validateAuth({
  subscriptionPlan,
  dbStoreName,
  userId,
}: ValidateAuthProps): Promise<boolean> {
  switch (subscriptionPlan) {
    case "basicPlan": {
      const { basicStorageLimit } = constants;
      const querier = await DbSectionsQuerier.init(userId, "userId");
      const count = await querier.storeSectionCount(dbStoreName);
      if (count < basicStorageLimit) return true;
      else
        throw new ResStatusError({
          errorMessage: `To save more than ${basicStorageLimit} of anything, you must have a Pro account.`,
          resMessage: `To save more than ${basicStorageLimit} of anything, you must have a Pro account.`,
          status: 400,
        });
    }
    case "fullPlan":
      return true;
  }
}
async function checkThatSectionPackIsNotThere<CN extends SectionQueryName>(
  props: DbSectionInitByIdProps<CN>
): Promise<true> {
  const { dbStoreName, dbId, userId } = props;
  try {
    const querier = await DbSectionsQuerier.init(userId, "userId");
    await querier.getSectionPack(props);
    throw new ResStatusError({
      errorMessage: `An entry at ${dbStoreName}.${dbId} already exists.`,
      resMessage: "The sent payload has already been saved.",
      status: 500,
    });
  } catch (err) {
    if (err instanceof SectionPackNotFoundError) {
      return true;
    } else {
      throw err;
    }
  }
}

function makePushParameters(dbPack: DbPack<any>) {
  const { dbStoreName, sectionPack } = dbPack;
  return {
    operation: { $push: { [dbStoreName]: sectionPack } },
    options: {
      new: true,
      lean: true,
      useFindAndModify: false,
      runValidators: true,
      strict: false,
      upsert: true,
    },
  };
}

interface DbSectionInitByIdProps<CN extends SectionQueryName>
  extends DbStoreInfo<CN> {
  userId: string;
}
