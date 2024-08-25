import { Obj } from "../utils/Obj";
import { envConstant } from "./envConstants";

const componentsRoute = "/components";
const activeDealRoute = "/active-deal";
const accountPageRoute = "/home";
export const feRoutes = {
  auth: "/login",
  paymentManagement: envConstant("paymentManagementLink"),
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
  compare: "/compare",
  userVariables: "/variables",
  userOutputs: "/outputs",
  handleAuth: "/handle-auth",
  subscribeSuccess: "/subscription-success",

  account: accountPageRoute,
  mainPage: accountPageRoute,

  createDeal: "/new-deal",
  activeDeal: `${activeDealRoute}`,
  activeProperty: `${activeDealRoute}/property`,
  activeFinancing: `${activeDealRoute}/financing`,
  activePurchaseFi: `${activeDealRoute}/purchase-financing`,
  activeRefi: `${activeDealRoute}/refinancing`,
  activeMgmt: `${activeDealRoute}/mgmt`,

  components: componentsRoute,
  repairsListMain: componentsRoute + "/repairs",
  sellingListMain: componentsRoute + "/repairs",
  utilitiesListMain: componentsRoute + "/utilities",
  capExListMain: componentsRoute + "/cap-ex",
  closingCostsListMain: componentsRoute + "/closing-costs",
  onetimeListMain: componentsRoute + "/custom-onetime-costs",
  ongoingListMain: componentsRoute + "/custom-ongoing-costs",
} as const;

const feRouteNames = Obj.keys(feRoutes);
export type FeRouteName = (typeof feRouteNames)[number];
export const isFeRouteName = (value: any): value is FeRouteName =>
  feRouteNames.includes(value);
