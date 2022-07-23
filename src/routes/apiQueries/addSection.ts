import { Request, Response } from "express";
import { DbPack } from "../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import {
  DbStoreInfo,
  DbStoreName,
} from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/dbStoreNames";
import authWare from "../../middleware/authWare";
import { ResStatusError } from "../../resErrorUtils";
import { DbSectionsQuerier } from "./shared/DbSections/DbSectionsQuerier";
import { SectionPackNotFoundError } from "./shared/DbSections/DbSectionsQuerierTypes";
import { DbUser } from "./shared/DbSections/DbUser";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";
import { sendSuccess } from "./shared/sendSuccess";
import { validateSectionPackReq } from "./shared/validateSectionPackReq";

export const addSectionWare = [authWare, addSectionServerSide] as const;
async function addSectionServerSide(req: Request, res: Response) {
  const {
    dbStoreName,
    sectionPack,
    user: { _id: userId },
  } = validateSectionPackReq(req).body;
  await checkThatSectionPackIsNotThere({
    dbStoreName,
    dbId: sectionPack.dbId,
    userId,
  });
  await findUserByIdAndUpdate({
    res,
    userId,
    queryParameters: makePushParameters({
      dbStoreName,
      sectionPack,
    }),
  });
  sendSuccess(res, "addSection", { data: { dbId: sectionPack.dbId } });
}

// I see. The benefit of sending this in a token is that I don't have
// to do an extra db query before every storage-related operation.
// That would be nice.

// But then I have to rewrite some tests.

// check for basicStorage auth for most section operations

// check for fullStorage auth for just addSection

async function hasBasicStorageAuth(userId: string) {
  const { apiStorageAuth } = await DbUser.queryByUserId(userId);
  if (["basicStorage", "fullStorage"].includes(apiStorageAuth)) {
    return true;
  } else return false;
}
async function hasFullStorageAuth(userId: string) {
  const { apiStorageAuth } = await DbUser.queryByUserId(userId);
  if (apiStorageAuth === "fullStorage") return true;
  else return false;
}
async function checkThatSectionPackIsNotThere<CN extends DbStoreName>(
  props: DbSectionInitByIdProps<CN>
): Promise<true> {
  const { dbStoreName, dbId } = props;
  try {
    const querier = await DbSectionsQuerier.initByUserId(props.userId);
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

function makePushParameters(dbPack: DbPack) {
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

interface DbSectionInitByIdProps<CN extends DbStoreName>
  extends DbStoreInfo<CN> {
  userId: string;
}
