import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { SubType } from "../../utils/types";
import {
  BaseSections,
  baseSections,
  SimpleSectionName,
  simpleSectionNames,
} from "../baseSections";
import { GeneralBaseSection } from "../baseSectionsUtils/baseSection";

type HasVarbSectionName<
  NoVarbSectionName = keyof SubType<
    BaseSections,
    { varbSchemas: { [K in any]: never } }
  >
> = Exclude<keyof BaseSections, NoVarbSectionName>;

type SnArrs = {
  [SN in keyof BaseSections]: SN[];
};
function makeSingleSectionNameArrs(): SnArrs {
  return Obj.keys(baseSections).reduce((snArrs, sectionName) => {
    (snArrs as any)[sectionName] = [sectionName];
    return snArrs;
  }, {} as SnArrs);
}

function makeBaseNameArrs() {
  return {
    ...makeSingleSectionNameArrs(),
    all: simpleSectionNames as SimpleSectionName[],
    notRootNorOmni: Arr.excludeStrict(simpleSectionNames, [
      "root",
      "omniParent",
    ] as const),
    hasVarb: Obj.keys(baseSections).filter((sectionName) => {
      const varbNames = Object.keys(
        (baseSections[sectionName] as any as GeneralBaseSection).varbSchemas
      );
      return varbNames.length > 0;
    }) as HasVarbSectionName[],
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

type GeneralBaseNameArrs = Record<string, readonly (keyof BaseSections)[]>;

export const baseNameArrs = makeBaseNameArrs();

const testBaseNameArrs = (_: GeneralBaseNameArrs) => undefined;
testBaseNameArrs(baseNameArrs);

export type BaseNameArrs = typeof baseNameArrs;
export type BaseNameSelector = keyof BaseNameArrs;
