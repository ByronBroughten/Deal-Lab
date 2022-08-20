import bcrypt from "bcrypt";
import { Response } from "express";
import mongoose from "mongoose";
import { constants } from "../../../../client/src/App/Constants";
import { LoginData } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/getUserData";
import { SubscriptionValues } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/SubscriptionValues";
import { defaultMaker } from "../../../../client/src/App/sharedWithServer/defaultMaker/defaultMaker";
import { SectionValues } from "../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsDerived/valueMetaTypes";
import { dbStoreNameS } from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import {
  isFeStoreTableName,
  relChildSections,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/relChildSections";
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
  static async getBy(specifierType: DbUserSpecifierType, specifier: string) {
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
  get userInfo(): GetterSection<"userInfo"> {
    return this.get.onlyChild("userInfo");
  }
  get subscriptionValues(): SubscriptionValues {
    if (isProEmail(this.email)) {
      return {
        subscriptionPlan: "fullPlan",
        planExp: timeS.now() + timeS.oneDay,
      };
    }

    const subscriptions = this.get.children("stripeSubscription");
    let subscriptionValues: SubscriptionValues = {
      subscriptionPlan: "basicPlan",
      planExp: timeS.hundredsOfYearsFromNow,
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
        currentPeriodEnd > subscriptionValues.planExp
      ) {
        const actives = Arr.findAll(constants.stripePrices, (subConfig) => {
          return priceIds.includes(subConfig.priceId);
        });
        const activePro = actives.find((active) => {
          active.product === "proPlan";
        });
        if (activePro) {
          subscriptionValues = {
            subscriptionPlan: "fullPlan",
            planExp: values.currentPeriodEnd,
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
    const feStore = PackBuilderSection.initAsOmniChild("feStore");
    feStore.loadSelf(defaultMaker.makeSectionPack("feStore"));
    for (const feStoreChildName of feStore.get.childNames) {
      if (isFeStoreTableName(feStoreChildName)) {
        const table = feStore.onlyChild(feStoreChildName);
        const { tableRowDbSource } = relChildSections.feStore[feStoreChildName];
        const dbSourceSn = this.sectionsMeta
          .section("dbStore")
          .childType(tableRowDbSource);
        const { dbIndexStoreName } = this.sectionsMeta.section(dbSourceSn);

        const sourcePacks = this.dbSections.sectionPackArr(dbIndexStoreName);
        const columns = table.get.children("column");
        for (const sourcePack of sourcePacks) {
          const source = PackBuilderSection.loadAsOmniChild(sourcePack);
          const displayName = source.get.value("displayName", "string");
          const row = table.addAndGetChild("tableRow", {
            dbId: source.get.dbId,
            dbVarbs: { displayName },
          });
          for (const column of columns) {
            const varb = source.get.varbByFocalMixed(
              column.valueInEntityInfo()
            );
            row.addChild("cell", {
              dbId: column.dbId,
              dbVarbs: {
                displayVarb: varb.displayVarb(),
                valueEntityInfo: column.valueInEntityInfo(),
              },
            });
          }
        }
      } else if (dbStoreNameS.is(feStoreChildName)) {
        feStore.loadChildren({
          childName: feStoreChildName,
          sectionPacks: this.dbSections.sectionPackArr(feStoreChildName),
        });
      } else if (feStoreChildName === "subscriptionInfo") {
        const { subscriptionPlan, planExp } = this.subscriptionValues;
        const subInfoValues: SectionValues<"subscriptionInfo"> = {
          plan: subscriptionPlan,
          planExp,
        };
        const subInfo = feStore.onlyChild("subscriptionInfo");
        subInfo.updater.updateValuesDirectly(subInfoValues);
      }
    }
    return {
      feStore: [feStore.makeSectionPack()],
    };
  }
  createUserInfoToken(subscriptionValues?: SubscriptionValues) {
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

  sendLogin(res: Response) {
    const loggedInUser = this.makeLoginUser();
    this.setResTokenHeader(res);
    res.status(200).send(loggedInUser);
  }
  static checkUserAuthToken = checkUserAuthToken;
}
