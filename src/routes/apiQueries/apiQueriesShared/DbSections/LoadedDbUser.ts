import { Response } from "express";
import { pick } from "lodash";
import mongoose from "mongoose";
import { constants } from "../../../../client/src/App/Constants";
import { AnalyzerPlanValues } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/AnalyzerPlanValues";
import { UserData } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/validateUserData";
import { SectionPack } from "../../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { storeNames } from "../../../../client/src/App/sharedWithServer/SectionsMeta/sectionStores";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../../../client/src/App/sharedWithServer/StatePackers/PackBuilderSection";
import { PackBuilderSections } from "../../../../client/src/App/sharedWithServer/StatePackers/PackBuilderSections";
import { Arr } from "../../../../client/src/App/sharedWithServer/utils/Arr";
import { stripeS } from "../../../../client/src/App/sharedWithServer/utils/stripe";
import { timeS } from "../../../../client/src/App/sharedWithServer/utils/timeS";
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
        labSubscription: "fullPlan",
        labSubscriptionExp: timeS.now() + timeS.oneDay,
      };
    }

    const subscriptions = this.get.children("stripeSubscription");
    let subscriptionValues: AnalyzerPlanValues = {
      labSubscription: "basicPlan",
      labSubscriptionExp: timeS.hundredsOfYearsFromNow,
    };

    const now = timeS.now();
    for (const sub of subscriptions) {
      const values = sub.values({
        subId: "string",
        status: "string",
        priceIds: "stringArray",
        currentPeriodEnd: "dateTime",
      });
      const { priceIds, currentPeriodEnd } = values;
      if (
        stripeS.isActiveSubStatus(values.status) &&
        currentPeriodEnd > now &&
        currentPeriodEnd > subscriptionValues.labSubscriptionExp
      ) {
        const actives = Arr.findAll(constants.stripePrices, (subConfig) => {
          return priceIds.includes(subConfig.priceId);
        });
        const activePro = actives.find((active) => {
          active.product === "proPlan";
        });
        if (activePro) {
          subscriptionValues = {
            labSubscription: "fullPlan",
            labSubscriptionExp: values.currentPeriodEnd,
          };
        }
      }
    }
    return subscriptionValues;
  }
  get userInfoPrivate(): GetterSection<"userInfoPrivate"> {
    return this.get.onlyChild("userInfoPrivate");
  }
  collectUserData(): UserData {
    const sessionStore = PackBuilderSection.initAsOmniChild("sessionStore");
    sessionStore.updateValues({
      archivedAreLoaded: false,
      showArchivedDeals: false,
    });

    const feStore = PackBuilderSections.initFeStore();
    feStore.updateValues({
      ...pick(this.userInfo, ["email", "userName"]),
      ...this.subscriptionValues,
      authStatus: "user",
      userDataStatus: "loaded",
    });

    const dealPacks = this.dbSections.sectionPackArr("dealMain");
    const feDealPacks = dealPacks.reduce((storePacks, pack) => {
      const deal = PackBuilderSection.hydratePackAsOmniChild(pack).get;
      sessionStore.addChild("dealMain", {
        dbId: deal.dbId,
        sectionValues: {
          dateTimeCreated: deal.valueNext("dateTimeFirstSaved"),
        },
      });
      if (!deal.valueNext("isArchived")) {
        storePacks.push(pack);
      }
      return storePacks;
    }, [] as SectionPack<"deal">[]);

    const feDealPackIds = feDealPacks.map(({ dbId }) => dbId);

    for (const storeName of storeNames) {
      if (storeName === "dealMain") {
        feStore.replaceChildren({
          childName: storeName,
          sectionPacks: feDealPacks,
        });
      } else if (storeName === "dealCompareMenu") {
        feStore.replaceChildren({
          childName: storeName,
          sectionPacks: this.dbSections.sectionPackArr(storeName),
        });
        const compareMenu = feStore.onlyChild("dealCompareMenu");
        compareMenu.children("comparedDeal").forEach((compared) => {
          if (!feDealPackIds.includes(compared.get.dbId)) {
            compared.removeSelf();
          }
        });
      } else {
        feStore.replaceChildren({
          childName: storeName,
          sectionPacks: this.dbSections.sectionPackArr(storeName),
        });
      }
    }
    return {
      feStore: feStore.makeSectionPack(),
      sessionStore: sessionStore.makeSectionPack(),
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
