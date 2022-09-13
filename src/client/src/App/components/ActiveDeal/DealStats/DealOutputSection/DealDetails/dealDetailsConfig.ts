import {
  SimpleSectionVarbName,
  simpleSectionVarbNames,
} from "../../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionTypes";

type DetailsConfig = {
  [SV in SimpleSectionVarbName]: DetailConfig;
};
type DetailConfig = {
  detailTitle: string | null;
};

const testDetailConfig = <DC extends DetailConfig>(dc: DC): DC => dc;
const defaultDetailConfig = testDetailConfig({
  detailTitle: null,
});

const defaultDetailsConfig = simpleSectionVarbNames.reduce(
  (detailsConfig, name) => {
    detailsConfig[name] = defaultDetailConfig;
    return detailsConfig;
  },
  {} as DetailsConfig
);

const testDetailConfigs = <DSC extends DetailsConfig>(dsc: DSC): DSC => dsc;
export const detailsConfig = testDetailConfigs({
  ...defaultDetailsConfig,
  "property.expensesMonthly": { detailTitle: "Ongoing property expenses" },
  "property.expensesYearly": { detailTitle: "Ongoing property expenses" },
  "mgmt.expensesMonthly": { detailTitle: "Ongoing management expenses" },
  "mgmt.expensesYearly": { detailTitle: "Ongoing management expenses" },
  "mgmtGeneral.expensesMonthly": {
    detailTitle: "Ongoing management expenses total",
  },
  "mgmtGeneral.expensesYearly": {
    detailTitle: "Ongoing management expenses total",
  },
  "loan.expensesMonthly": { detailTitle: "Ongoing loan expenses" },
  "loan.expensesYearly": { detailTitle: "Ongoing loan expenses" },
  "financing.expensesMonthly": { detailTitle: "Ongoing loan expenses total" },
  "financing.expensesYearly": { detailTitle: "Ongoing loan expenses total" },
});