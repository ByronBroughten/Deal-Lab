import bcrypt from "bcrypt";
import { Response } from "express";
import { pick } from "lodash";
import mongoose from "mongoose";
import { constants } from "../../../../client/src/App/Constants";
import { FeUserSolver } from "../../../../client/src/App/modules/SectionSolvers/FeUserSolver";
import { AnalyzerPlanValues } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/AnalyzerPlanValues";
import { LoginData } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/getUserData";
import {
  AuthStatus,
  UserDataStatus,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsVarbs";
import { SectionPack } from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { FeSectionInfo } from "../../../../client/src/App/sharedWithServer/SectionsMeta/Info";
import {
  FeUserDbIndex,
  relChildSections,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/relChildSections";
import {
  FeStoreNameByType,
  feStoreNameS,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { sectionNameS } from "../../../../client/src/App/sharedWithServer/SectionsMeta/SectionNameByType";
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
  get userInfo(): GetterSection<"basicUserInfo"> {
    return this.get.onlyChild("basicUserInfo");
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
  makeLoginUser(): LoginData {
    const feUser = FeUserSolver.initDefault();
    for (const feStoreName of feUser.get.childNames) {
      if (feStoreNameS.is(feStoreName, "displayStoreName")) {
        const dbIndexName = this.displayToDbStoreName(feStoreName);
        const sources = this.get.children(dbIndexName);
        feUser.loadDisplayStoreList(feStoreName, sources);
      } else if (feStoreNameS.is(feStoreName, "fullIndex")) {
        feUser.packBuilder.replaceChildren({
          childName: feStoreName,
          sectionPacks: this.dbSections.sectionPackArr(feStoreName),
        });
      } else if (feStoreNameS.is(feStoreName, "mainTableName")) {
        feUser.packBuilder.replaceChildren({
          childName: feStoreName,
          sectionPacks: this.dbSections.sectionPackArr(feStoreName),
        });
      } else if (feStoreName === "userInfoNext") {
        const userInfo = feUser.packBuilder.onlyChild("userInfoNext");
        userInfo.updater.updateValues({
          ...pick(this.userInfo, ["email", "userName"]),
          ...this.subscriptionValues,
          authStatus: "user" as AuthStatus,
          userDataStatus: "loaded" as UserDataStatus,
        });
      }
    }
    return {
      feUser: [feUser.packBuilder.makeSectionPack()],
    };
  }
  displayToDbStoreName<SN extends FeStoreNameByType<"displayStoreName">>(
    sectionName: SN
  ): FeUserDbIndex<SN> {
    const relFeUser = relChildSections.feUser;
    const { dbIndexName } = relFeUser[sectionName];
    return dbIndexName;
  }
  initActiveAsSaved(feUser: FeUserSolver, activeDealPack: SectionPack<"deal">) {
    const headSection = PackBuilderSection.loadAsOmniChild(activeDealPack);
    const { sections } = headSection;
    let sectionInfos: FeSectionInfo[] = [headSection.feInfo];
    while (sectionInfos.length > 0) {
      const nextInfos: FeSectionInfo[] = [];
      for (const { sectionName, feId } of sectionInfos) {
        const section = sections.section({ sectionName, feId });
        if (sectionNameS.is(sectionName, "hasFeDisplayIndex")) {
          const { displayIndexName } =
            headSection.sectionsMeta.get(sectionName);
          const displayIndexBuilder =
            feUser.displayIndexBuilder(displayIndexName);
          if (displayIndexBuilder.hasByDbId(section.get.dbId)) {
            const child = this.get.childByDbId({
              childName: this.displayToDbStoreName(displayIndexName),
              dbId: section.get.dbId,
            });
            displayIndexBuilder.addAsSavedIfMissing(
              child.packMaker.makeSectionPack()
            );
          }
        }
        for (const childName of section.get.childNames) {
          for (const child of section.children(childName)) {
            nextInfos.push(child.feInfo);
          }
        }
      }
      sectionInfos = nextInfos;
    }
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
    res.header(constants.tokenKey.apiUserAuth, token);
  }

  sendLogin(res: Response): void {
    const loggedInUser = this.makeLoginUser();
    this.setResTokenHeader(res);
    res.status(200).send(loggedInUser);
  }
  static checkUserAuthToken = checkUserAuthToken;
}
