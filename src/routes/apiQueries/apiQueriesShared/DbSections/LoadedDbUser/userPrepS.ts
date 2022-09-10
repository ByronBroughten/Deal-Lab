import bcrypt from "bcrypt";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { dbStoreNames } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { PackBuilderSection } from "../../../../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { timeS } from "../../../../../client/src/App/sharedWithServer/utils/date";
import { StrictPick } from "../../../../../client/src/App/sharedWithServer/utils/types";
import { ResStatusError } from "../../../../../utils/resError";
import { DbUserModel, RawDbUser } from "../../../../routesShared/DbUserModel";
import { DbUser } from "../DbUser";
import { InitialUserSectionPackArrs, PreppedEmails } from "./userPrepSTypes";

export type SignUpData = {
  authId: string;
  email: string;
  userName: string;
  timeJoined: number;
};

export function getSignUpData(
  user: ThirdPartyEmailPassword.User
): StrictPick<SignUpData, "authId" | "email" | "timeJoined"> {
  const { id, email, timeJoined } = user;
  return {
    authId: id,
    email,
    timeJoined: timeS.millisecondsToStandard(timeJoined),
  };
}

export const userPrepS = {
  async initUserInDb(props: SignUpData) {
    // const { email, authId } = props;
    // const userExists =
    //   (await DbUser.existsBy("email", email)) ||
    //   (await DbUser.existsBy("authId", authId));

    // if (!userExists) {
    //   const dbUserModel = new DbUserModel(this.initRawDbUser(props));
    //   await dbUserModel.save();
    // }
    const dbUserModel = new DbUserModel(this.initRawDbUser(props));
    await dbUserModel.save();
  },
  initRawDbUser(props: SignUpData): RawDbUser {
    return {
      ...this.makeEmptyRawDbUser(),
      ...this.initUserSectionPackArrs(props),
    };
  },
  makeEmptyRawDbUser(): RawDbUser {
    return dbStoreNames.reduce((rawDbUser, dbStoreName) => {
      rawDbUser[dbStoreName] = [];
      return rawDbUser;
    }, {} as RawDbUser);
  },
  initUserSectionPackArrs({
    authId,
    email,
    userName,
    timeJoined,
  }: SignUpData): InitialUserSectionPackArrs {
    return {
      userInfo: [
        PackBuilderSection.initSectionPack("userInfo", {
          dbVarbs: {
            userName,
            email,
            timeJoined,
          },
        }),
      ],
      userInfoPrivate: [
        PackBuilderSection.initSectionPack("userInfoPrivate", {
          dbVarbs: { guestSectionsAreLoaded: false },
        }),
      ],
      authInfoPrivate: [
        PackBuilderSection.initSectionPack("authInfoPrivate", {
          dbVarbs: { authId },
        }),
      ],
      stripeInfoPrivate: [
        PackBuilderSection.initSectionPack("stripeInfoPrivate", {
          dbVarbs: {
            customerId: "",
          },
        }),
      ],
    };
  },
};

const depreciatedUtils = {
  async encryptPassword(unencrypted: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(unencrypted, salt);
  },
  async checkThatEmailIsUnique(email: string): Promise<void> {
    if (await DbUser.existsBy("email", email)) {
      throw new ResStatusError({
        errorMessage: `An account with the email ${email} already exists.`,
        resMessage: "An account with that email already exists",
        status: 400,
      });
    }
  },
  processEmail(rawEmail: string): PreppedEmails {
    const emailAsSubmitted = rawEmail.trim();
    const email = emailAsSubmitted.toLowerCase();
    return {
      emailAsSubmitted,
      email,
    };
  },
};
