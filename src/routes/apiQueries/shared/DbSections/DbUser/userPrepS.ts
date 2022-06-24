import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { makeMongooseObjectId } from "../../../../../client/src/App/sharedWithServer/utils/mongoose";
import { ResStatusError } from "../../../../../resErrorUtils";
import { DbSectionsQuerier } from "../DbSectionsQuerier";

type PreppedEmails = {
  emailAsSubmitted: string;
  email: string;
};

export const testRegisterId = makeMongooseObjectId();

export const userPrepS = {
  async encryptPassword(unencrypted: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(unencrypted, salt);
  },
  processEmail(rawEmail: string): PreppedEmails {
    const emailAsSubmitted = rawEmail.trim();
    const email = emailAsSubmitted.toLowerCase();
    return {
      emailAsSubmitted,
      email,
    };
  },
  async checkThatEmailIsUnique(email: string): Promise<void> {
    if (await DbSectionsQuerier.existsByEmail(email)) {
      throw new ResStatusError({
        errorMessage: `An account with the email ${email} already exists.`,
        resMessage: "An account with that email already exists",
        status: 400,
      });
    }
  },
  makeNewUserId(): mongoose.Types.ObjectId {
    if (process.env.NODE_ENV === "test") return testRegisterId;
    else return makeMongooseObjectId();
  },
};
