import bcrypt from "bcrypt";
import { Response } from "express";
import { pick } from "lodash";
import mongoose from "mongoose";
import { constants } from "../../../../client/src/App/Constants";
import { FeUserSolver } from "../../../../client/src/App/modules/SectionSolvers/FeUserSolver";
import { AnalyzerPlanValues } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/AnalyzerPlanValues";
import { UserData } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/validateUserData";
import { UserDataStatus } from "../../../../client/src/App/sharedWithServer/SectionsMeta/allBaseSectionVarbs";
import { AuthStatus } from "../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsVarbsValues";
import { feStoreNameS } from "../../../../client/src/App/sharedWithServer/SectionsMeta/relSectionsDerived/FeStoreName";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { Arr } from "../../../../client/src/App/sharedWithServer/utils/Arr";
import { timeS } from "../../../../client/src/App/sharedWithServer/utils/date";
import { stripeS } from "../../../../client/src/App/sharedWithServer/utils/stripe";
import { HandledResStatusError } from "../../../../utils/resError";
import { isProEmail } from "../../../routeUtils/proList";
import { DbSections } from "./DbSections";
import { DbUser } from "./DbUser";
import { DbSectionsRaw, DbUserSpecifierType } from "./DbUserTypes";
import {
  checkUserAuthToken,
  createUserInfoToken,
} from "./LoadedDbUser/userAuthToken";

interface DbUserProps extends GetterSectionProps<"dbStore"> {
  dbSections: DbSections;
}

export class LoadedDbUser extends GetterSectionBase<"dbStore"> {
  readonly dbSections: DbSections;
  constructor({ dbSections, ...rest }: DbUserProps) {
    super(rest);
    this.dbSections = dbSections;
  }
  get dbSectionsRaw(): DbSectionsRaw {
    return this.dbSections.dbSectionsRaw;
  }
  get userId(): string {
    const userId = this.dbSectionsRaw._id as mongoose.Types.ObjectId;
    if (!(userId instanceof mongoose.Types.ObjectId))
      throw new Error(`userId "${userId}" is not valid.`);
    return userId.toHexString();
  }
  get authId(): string {
    const authInfo = this.get.onlyChild("authInfoPrivate");
    return authInfo.value("authId", "string");
  }
  get customerId(): string {
    const stripeInfoPrivate = this.get.onlyChild("stripeInfoPrivate");
    return stripeInfoPrivate.value("customerId", "string");
  }
  get email(): string {
    return this.userInfo.value("email", "string");
  }
  static async getBy(
    specifierType: DbUserSpecifierType,
    specifier: string
  ): Promise<LoadedDbUser> {
    const dbUser = await DbUser.initBy(specifierType, specifier);
    return dbUser.loadedDbUser();
  }
  static async queryByEmail(email: string): Promise<LoadedDbUser> {
    const dbUser = await DbUser.initByEmail(email);
    return dbUser.loadedDbUser();
  }
  get get(): GetterSection<"dbStore"> {
    return new GetterSection(this.getterSectionProps);
  }
  get builder(): PackBuilderSection<"dbStore"> {
    return new PackBuilderSection(this.getterSectionProps);
  }
  get userInfo(): GetterSection<"userInfo"> {
    return this.get.onlyChild("userInfo");
  }
  get subscriptionValues(): AnalyzerPlanValues {
    if (isProEmail(this.email)) {
      return {
        analyzerPlan: "fullPlan",
        analyzerPlanExp: timeS.now() + timeS.oneDay,
      };
    }

    const subscriptions = this.get.children("stripeSubscription");
    let subscriptionValues: AnalyzerPlanValues = {
      analyzerPlan: "basicPlan",
      analyzerPlanExp: timeS.hundredsOfYearsFromNow,
    };

    const now = timeS.now();
    for (const sub of subscriptions) {
      const values = sub.values({
        subId: "string",
        status: "string",
        priceIds: "stringArray",
        currentPeriodEnd: "number",
      });
      const { priceIds, currentPeriodEnd } = values;
      if (
        stripeS.isActiveSubStatus(values.status) &&
        currentPeriodEnd > now &&
        currentPeriodEnd > subscriptionValues.analyzerPlanExp
      ) {
        const actives = Arr.findAll(constants.stripePrices, (subConfig) => {
          return priceIds.includes(subConfig.priceId);
        });
        const activePro = actives.find((active) => {
          active.product === "proPlan";
        });
        if (activePro) {
          subscriptionValues = {
            analyzerPlan: "fullPlan",
            analyzerPlanExp: values.currentPeriodEnd,
          };
        }
      }
    }
    return subscriptionValues;
  }
  get userInfoPrivate(): GetterSection<"userInfoPrivate"> {
    return this.get.onlyChild("userInfoPrivate");
  }
  async validatePassword(attemptedPassword: string): Promise<void> {
    const encryptedPassword = this.userInfoPrivate.value(
      "encryptedPassword",
      "string"
    );
    const isValid = await bcrypt.compare(attemptedPassword, encryptedPassword);
    if (!isValid) {
      throw new HandledResStatusError({
        resMessage: "That password is incorrect.",
        status: 400,
      });
    }
  }
  collectUserData(): UserData {
    const feUser = FeUserSolver.initDefault();
    feUser.packBuilder.updateValues({
      ...pick(this.userInfo, ["email", "userName"]),
      ...this.subscriptionValues,
      authStatus: "user" as AuthStatus,
      userDataStatus: "loaded" as UserDataStatus,
    });
    for (const storeName of feStoreNameS.arrs.fullIndex) {
      feUser.packBuilder.replaceChildren({
        childName: storeName,
        sectionPacks: this.dbSections.sectionPackArr(storeName),
      });
    }
    for (const storeName of feStoreNameS.arrs.mainTableName) {
      feUser.packBuilder.replaceChildren({
        childName: storeName,
        sectionPacks: this.dbSections.sectionPackArr(storeName),
      });
    }
    return {
      feUser: feUser.packBuilder.makeSectionPack(),
    };
  }
  createUserInfoToken(subscriptionValues?: AnalyzerPlanValues): string {
    return createUserInfoToken({
      userId: this.userId,
      ...this.subscriptionValues,
      ...subscriptionValues,
    });
  }
  setResTokenHeader(res: Response): void {
    const token = this.createUserInfoToken();
    LoadedDbUser.setResTokenHeader(res, token);
  }
  static setResTokenHeader(res: Response, token: string): void {
    res.header(constants.tokenKey.userAuthData, token);
  }

  sendUserData(res: Response): void {
    const userData = this.collectUserData();
    this.setResTokenHeader(res);
    res.status(200).send(userData);
  }
  static checkUserAuthToken = checkUserAuthToken;
}
