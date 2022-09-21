import { Arr } from "../../utils/Arr";
import {
  BaseSectionsVarbs,
  SimpleSectionName,
  simpleSectionNames,
} from "../baseSectionsVarbs";

type SnArrs = {
  [SN in SimpleSectionName]: SN[];
};
function makeSingleSectionNameArrs(): SnArrs {
  return simpleSectionNames.reduce((snArrs, sectionName) => {
    (snArrs as any)[sectionName] = [sectionName];
    return snArrs;
  }, {} as SnArrs);
}

function makeBaseNameArrs() {
  return {
    ...makeSingleSectionNameArrs(),
    all: simpleSectionNames as SimpleSectionName[],
    hasVarb: simpleSectionNames,
    notRootNorOmni: Arr.excludeStrict(simpleSectionNames, [
      "root",
      "omniParent",
    ] as const),
    get additiveList() {
      return Arr.extractStrict(simpleSectionNames, [
        "singleTimeList",
        "ongoingList",
      ] as const);
    },
    get varbListAllowed() {
      return Arr.extractStrict(simpleSectionNames, [
        "singleTimeList",
        "ongoingList",
        "userVarbList",
        "outputList",
      ] as const);
    },
  };
}

type GeneralBaseNameArrs = Record<string, readonly (keyof BaseSectionsVarbs)[]>;

export const baseNameArrs = makeBaseNameArrs();

const testBaseNameArrs = (_: GeneralBaseNameArrs) => undefined;
testBaseNameArrs(baseNameArrs);

export type BaseNameArrs = typeof baseNameArrs;
export type BaseNameSelector = keyof BaseNameArrs;
