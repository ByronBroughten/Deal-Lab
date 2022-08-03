import bcrypt from "bcrypt";
import { Response } from "express";
import mongoose from "mongoose";
import { constants } from "../../../../client/src/App/Constants";
import { LoginUser } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/login";
import { RegisterReqBody } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { defaultMaker } from "../../../../client/src/App/sharedWithServer/defaultMaker/defaultMaker";
import {
  dbStoreNameS,
  dbStoreNames
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import {
  isFeStoreTableName,
  relChildSections
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/relChildSections";
import { SectionValues } from "../../../../client/src/App/sharedWithServer/SectionsMeta/relSectionsUtils/valueMetaTypes";
import {
  GetterSectionBase,
  GetterSectionProps
} from "../../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { Arr } from "../../../../client/src/App/sharedWithServer/utils/Arr";
import { getStandardNow } from "../../../../client/src/App/sharedWithServer/utils/date";
import { stripeS } from "../../../../client/src/App/sharedWithServer/utils/stripe";
import { HandledResStatusError } from "../../../../resErrorUtils";
import { isProEmail } from "../../../routeUtils/proList";
import { DbSectionsProps } from "./Bases/DbSectionsBase";
import { DbSections } from "./DbSections";
import {
  checkUserAuthToken,
  createUserAuthToken,
  SubscriptionProps
} from "./LoadedDbUser/userAuthToken";
import { SignUpData, userPrepS } from "./LoadedDbUser/userPrepS";
import { QueryUser } from "./QueryUser";
import { DbSectionsRaw, DbUserSpecifierType } from "./QueryUserTypes";

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
  private static init(props: DbSectionsProps) {
    const dbSections = new DbSections(props);
    const dbStore = PackBuilderSection.initAsOmniChild("dbStore");
    for (const childName of dbStoreNames) {
      const sectionPacks = dbSections.sectionPackArr(childName);
      dbStore.loadChildren({
        childName,
        sectionPacks,
      });
    }
    return new LoadedDbUser({
      ...dbStore.getterSectionProps,
      dbSections,
    });
  }

  static async initializeUser(props: SignUpData) {
    const userPackArrs = userPrepS.initUserSectionPackArrs(props);
  }
  static async createAndSaveNew({
    registerFormData,
    guestAccessSections,
    _id,
  }: CreateUserProps): Promise<string> {
    const userPackArrs = await userPrepS.initUserSectionPacks(registerFormData);
    const dbSectionsRaw = userPrepS.makeDbSectionsRaw({
      ...userPackArrs,
      ...guestAccessSections,
      _id,
    });
    await dbSectionsRaw.save();
    return dbSectionsRaw._id.toHexString();
  }
  static async createSaveGet(props: CreateUserProps): Promise<LoadedDbUser> {
    const userId = await this.createAndSaveNew(props);    
    return LoadedDbUser.getBy("userId", userId);;
  }
  static async getBy(specifierType: DbUserSpecifierType, specifier: string) {
    const querier = await QueryUser.init(specifier, specifierType);
    return LoadedDbUser.init({
      dbSectionsRaw: await querier.getDbSectionsRaw(),
    });
  }

  static async queryByUserId(userId: string): Promise<LoadedDbUser> {
    const querier = await QueryUser.init(userId, "userId");
    return LoadedDbUser.init({
      dbSectionsRaw: await querier.getDbSectionsRaw(),
    });
  }
  static async queryByAuthId(authId: string): Promise<LoadedDbUser> {
    const querier = await QueryUser.init(authId, "authId");
    return LoadedDbUser.init({
      dbSectionsRaw: await querier.getDbSectionsRaw(),
    });
  }
  static async queryByEmail(email: string): Promise<LoadedDbUser> {
    const querier = await QueryUser.initByEmail(email);
    return LoadedDbUser.init({
      dbSectionsRaw: await querier.getDbSectionsRaw(),
    });
  }
  static async queryByCustomerId(customerId: string): Promise<LoadedDbUser> {
    const querier = await QueryUser.init(customerId, "customerId");
    return LoadedDbUser.init({
      dbSectionsRaw: await querier.getDbSectionsRaw(),
    });
  }
  get get(): GetterSection<"dbStore"> {
    return new GetterSection(this.getterSectionProps);
  }
  get userInfo(): GetterSection<"userInfo"> {
    return this.get.onlyChild("userInfo");
  }
  get email(): string {
    return this.userInfo.value("email", "string");
  }
  get customerId(): string {
    const stripeInfoPrivate = this.get.onlyChild("stripeInfoPrivate");
    return stripeInfoPrivate.value("customerId", "string");
  }
  get subscriptionProps(): SubscriptionProps {
    if (isProEmail(this.email)) {
      return {
        subscriptionPlan: "fullPlan",
        planExp: 9999999999,
      };
    }

    const subscriptions = this.get.children("stripeSubscription");
    let subscriptionProps: SubscriptionProps = {
      subscriptionPlan: "basicPlan",
      planExp: 0,
    };

    const now = getStandardNow();
    for (const sub of subscriptions) {
      const values = sub.values({
        subId: "string",
        subStatus: "string",
        priceIds: "stringArray",
        currentPeriodEnd: "number",
      });
      const { priceIds, currentPeriodEnd } = values;
      if (
        stripeS.isActiveSubStatus(values.subStatus) &&
        currentPeriodEnd > now &&
        currentPeriodEnd > subscriptionProps.planExp
      ) {
        const actives = Arr.findAll(constants.subscriptions, (subConfig) => {
          return priceIds.includes(subConfig.priceId);
        });
        const activePro = actives.find((active) => {
          active.product === "proPlan";
        });
        if (activePro) {
          subscriptionProps = {
            subscriptionPlan: "fullPlan",
            planExp: values.currentPeriodEnd,
          };
        }
      }
    }
    return subscriptionProps;
  }
  get dbOnlyUserInfo(): GetterSection<"dbOnlyUserInfo"> {
    return this.get.onlyChild("dbOnlyUserInfo");
  }
  async validatePassword(attemptedPassword: string): Promise<void> {
    const encryptedPassword = this.dbOnlyUserInfo.value(
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
  makeLoginUser(): LoginUser {
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
        const { subscriptionPlan, planExp } = this.subscriptionProps;
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
  createUserAuthToken() {
    return createUserAuthToken({
      userId: this.userId,
      ...this.subscriptionProps,
    });
  }
  setResTokenHeader(res: Response): void {
    const token = this.createUserAuthToken();
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

interface CreateUserProps extends RegisterReqBody {
  _id?: mongoose.Types.ObjectId;
}
