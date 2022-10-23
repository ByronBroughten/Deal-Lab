import { Request, Response } from "express";
import { constants } from "../../client/src/App/Constants";
import { UserInfoTokenProp } from "../../client/src/App/modules/services/authService";
import { AnalyzerPlan } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsVarbs";
import { DbPack } from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbSectionPack";
import {
  DbStoreInfo,
  SectionQueryName,
} from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { getAuthWare } from "../../middleware/authWare";
import { checkUserInfoWare } from "../../middleware/checkUserInfoWare";
import { ResStatusError } from "../../utils/resError";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";
import { SectionPackNotFoundError } from "./apiQueriesShared/DbSections/DbUserTypes";
import { findUserByIdAndUpdate } from "./apiQueriesShared/findAndUpdate";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";
import { validateSectionPackReq } from "./apiQueriesShared/validateSectionPackReq";

export const addSectionWare = [
  getAuthWare(),
  checkUserInfoWare,
  addSection,
] as const;
async function addSection(req: Request, res: Response) {
  const {
    dbStoreName,
    sectionPack,
    userJwt: { userId, analyzerPlan },
  } = validateSectionPackReq(req).body;
  await validateStorageLimit({
    userId,
    dbStoreName,
    analyzerPlan,
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
  sendSuccess(res, "addSection", {
    data: { dbId: sectionPack.dbId },
    headers: req.headers as UserInfoTokenProp,
  });
}

type ValidateSubscriptionProps = {
  analyzerPlan: AnalyzerPlan;
  dbStoreName: SectionQueryName;
  userId: string;
};
async function validateStorageLimit({
  analyzerPlan,
  dbStoreName,
  userId,
}: ValidateSubscriptionProps): Promise<boolean> {
  if (constants.isBeta) {
    return true;
  }
  switch (analyzerPlan) {
    case "basicPlan": {
      const { basicStorageLimit } = constants;
      const querier = await DbUser.initBy("userId", userId);
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
    const querier = await DbUser.initBy("userId", userId);
    await querier.getSectionPack(props);
    throw new ResStatusError({
      errorMessage: `An entry at ${dbStoreName}.${dbId} already exists.`,
      resMessage:
        "That section has already been saved. Try logging out and logging back in. Our apologies.",
      status: 400,
    });
  } catch (err) {
    if (err instanceof SectionPackNotFoundError) {
      return true;
    } else {
      throw err;
    }
  }
}

function makePushParameters({ dbStoreName, sectionPack }: DbPack<any>) {
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
