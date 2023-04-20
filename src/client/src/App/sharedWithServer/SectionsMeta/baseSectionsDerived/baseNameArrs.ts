import { Arr } from "../../utils/Arr";
import { SectionName, sectionNames } from "../SectionName";

type SnArrs = {
  [SN in SectionName]: SN[];
};
function makeSingleSectionNameArrs(): SnArrs {
  return sectionNames.reduce((snArrs, sectionName) => {
    (snArrs as any)[sectionName] = [sectionName];
    return snArrs;
  }, {} as SnArrs);
}

function makeBaseNameArrs() {
  return {
    ...makeSingleSectionNameArrs(),
    all: sectionNames as readonly SectionName[],
    hasVarb: sectionNames,
    mainDealSection: Arr.extractStrict(sectionNames, [
      "deal",
      "property",
      "loan",
      "mgmt",
    ] as const),
    dealSupports: Arr.extractStrict(sectionNames, [
      "dealSupplements",
      "dealSystem",
    ] as const),
    notRootNorOmni: Arr.excludeStrict(sectionNames, [
      "root",
      "omniParent",
    ] as const),
    get additiveList() {
      return Arr.extractStrict(sectionNames, [
        "singleTimeList",
        "ongoingList",
      ] as const);
    },
    get userVariable() {
      return Arr.extractStrict(sectionNames, [
        "numVarbItem",
        "boolVarbItem",
      ] as const);
    },
    get varbValue() {
      return Arr.extractStrict(sectionNames, [
        "ongoingValue",
        "singleTimeValue",
      ] as const);
    },
    get varbListAllowed() {
      return Arr.extractStrict(sectionNames, [
        "capExList",
        "singleTimeList",
        "ongoingList",
        "numVarbList",
        "outputList",
      ] as const);
    },
  };
}

type GeneralBaseNameArrs = Record<string, readonly SectionName[]>;
export const baseNameArrs = makeBaseNameArrs();

const testBaseNameArrs = (_: GeneralBaseNameArrs) => undefined;
testBaseNameArrs(baseNameArrs);

export type BaseNameArrs = typeof baseNameArrs;
export type BaseNameSelector = keyof BaseNameArrs;
