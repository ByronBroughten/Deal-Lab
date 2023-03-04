import { Obj } from "../sharedWithServer/utils/Obj";
import { envName } from "./envName";

const envs = {
  development: {
    paymentManagementLink:
      "https://billing.stripe.com/p/login/test_5kA16HgOu6k00nubII",
  },
  production: {
    paymentManagementLink:
      "https://billing.stripe.com/p/login/cN24j771Yd5qc3C9AA",
  },
};

const env = envs[envName];
const componentsRoute = "/components";
const activeDealRoute = "/active-deal";
export const feRoutes = {
  auth: "/login",
  paymentManagement: env.paymentManagementLink,
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
  compare: "/compare",
  userVariables: "/variables",
  userOutputs: "/outputs",
  authSuccess: "/login-success",
  subscribeSuccess: "/subscription-success",

  mainPage: activeDealRoute,

  activeDeal: activeDealRoute,
  activeProperty: `${activeDealRoute}/property`,
  activeFinancing: `${activeDealRoute}/financing`,
  activeMgmt: `${activeDealRoute}/mgmt`,

  components: componentsRoute,
  repairsListMain: componentsRoute + "/repairs",
  utilitiesListMain: componentsRoute + "/utilities",
  capExListMain: componentsRoute + "/cap-ex",
  closingCostsListMain: componentsRoute + "/closing-costs",
  singleTimeListMain: componentsRoute + "/custom-one-time-costs",
  ongoingListMain: componentsRoute + "/custom-ongoing-costs",
} as const;

const feRouteNames = Obj.keys(feRoutes);
export type FeRouteName = typeof feRouteNames[number];
