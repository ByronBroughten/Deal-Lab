import { pick } from "lodash";
import mongoose from "mongoose";
import { EstimatorPlanValues } from "../client/src/sharedWithServer/apiQueriesShared/EstimatorPlanValues";
import { constants } from "../client/src/sharedWithServer/Constants";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../client/src/sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../client/src/sharedWithServer/StateGetters/GetterSection";
import { makeDefaultSessionDeal } from "../client/src/sharedWithServer/StateOperators/defaultMaker/defaultSessionDeal";
import { PackBuilderSection } from "../client/src/sharedWithServer/StateOperators/Packers/PackBuilderSection";
import { PackBuilderSections } from "../client/src/sharedWithServer/StateOperators/Packers/PackBuilderSections";
import { storeNames } from "../client/src/sharedWithServer/stateSchemas/sectionStores";
import { SectionPack } from "../client/src/sharedWithServer/StateTransports/SectionPack";
import { UserData } from "../client/src/sharedWithServer/StateTransports/UserData";
import { Arr } from "../client/src/sharedWithServer/utils/Arr";
import { stripeS } from "../client/src/sharedWithServer/utils/stripe";
import { timeS } from "../client/src/sharedWithServer/utils/timeS";
import { DbUserService } from "../DbUserService";
import { createUserJwt } from "../middleware/jwtWare";
import { DbSectionsRaw, DbUserSpecifierType } from "./DbUserFiltersAndPaths";
import { DbUserQuickGetter } from "./DbUserQuickGetter";
import { isProEmail } from "./isProEmail";

interface DbUserProps extends GetterSectionProps<"dbStore"> {
  quickGetter: DbUserQuickGetter;
}
export class DbUserGetter extends GetterSectionBase<"dbStore"> {
  readonly quickGetter: DbUserQuickGetter;
  constructor({ quickGetter, ...rest }: DbUserProps) {
    super(rest);
    this.quickGetter = quickGetter;
  }
  get dbSectionsRaw(): DbSectionsRaw {
    return this.quickGetter.dbSectionsRaw;
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
  ): Promise<DbUserGetter> {
    const dbUser = await DbUserService.initBy(specifierType, specifier);
    return dbUser.dbUserGetter();
  }
  static async queryByEmail(email: string): Promise<DbUserGetter> {
    const dbUser = await DbUserService.initByEmail(email);
    return dbUser.dbUserGetter();
  }
  get get(): GetterSection<"dbStore"> {
    return new GetterSection(this.getterSectionProps);
  }
  get userInfo(): GetterSection<"userInfo"> {
    return this.get.onlyChild("userInfo");
  }
  get subscriptionValues(): EstimatorPlanValues {
    if (isProEmail(this.email)) {
      return {
        labSubscription: "fullPlan",
        labSubscriptionExp: timeS.now() + timeS.oneDay,
      };
    }

    const subscriptions = this.get.children("stripeSubscription");
    let subscriptionValues: EstimatorPlanValues = {
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

    const dealPacks = this.quickGetter.sectionPackArr("dealMain");
    const feDealPacks = dealPacks.reduce((storePacks, pack) => {
      const deal = PackBuilderSection.hydratePackAsOmniChild(pack).get;
      sessionStore.addChild("dealMain", {
        sectionPack: makeDefaultSessionDeal(deal),
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
          sectionPacks: this.quickGetter.sectionPackArr(storeName),
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
          sectionPacks: this.quickGetter.sectionPackArr(storeName),
        });
      }
    }
    return {
      feStore: feStore.makeSectionPack(),
      sessionStore: sessionStore.makeSectionPack(),
    };
  }
  createUserJwt(subscriptionValues?: EstimatorPlanValues): string {
    return createUserJwt({
      userId: this.userId,
      ...this.subscriptionValues,
      ...subscriptionValues,
    });
  }
}
