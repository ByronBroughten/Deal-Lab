import { Obj } from "../../utils/Obj";
import { PropKeyOfValue } from "../../utils/Obj/SubType";
import { MergeUnionObjFull } from "../../utils/types/mergeUnionObj";
import { allSectionChildren, SectionChildProps } from "../allSectionChildren";
import { GeneralChildrenSections } from "../allSectionChildren/sectionChildren";
import { SectionName, sectionNames } from "../SectionName";
import { ChildName, sectionToChildNames } from "./ChildName";

export type ChildToSectionName = SectionChildProps<"sectionName">;

export const childToSectionNames = sectionNames.reduce(
  (result, sectionName) => {
    const sectionChild = allSectionChildren[
      sectionName
    ] as GeneralChildrenSections;
    const childNames = sectionToChildNames[sectionName];
    const toSectionNames = (childNames as string[]).reduce(
      (childObj, childName) => {
        childObj[childName] = sectionChild[childName].sectionName;
        return childObj;
      },
      {} as { [key: string]: string }
    );
    (result as any)[sectionName] = toSectionNames;
    return result;
  },
  {} as ChildToSectionName
);

export function childToSectionName<
  SN extends SectionName,
  CN extends ChildName<SN>
>(sectionName: SN, childName: CN): ChildSectionName<SN, CN> {
  const names = childToSectionNames[sectionName] as {
    [key: string]: string;
  };
  if (!names || !names[childName]) {
    throw new Error(
      `childName "${childName}" did not yield a childType from parent of type ${sectionName}`
    );
  }
  return names[childName] as ChildSectionName<SN, CN>;
}

type MergedChildNames<SN extends SectionName> = MergeUnionObjFull<
  ChildToSectionName[SN]
>;

export type ChildSectionNamePureWide<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = MergedChildNames<SN>[CN & keyof MergedChildNames<SN>];

export type ChildSectionNamePure<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = ChildToSectionName[SN][CN & keyof ChildToSectionName[SN]];

export type ChildSectionNameNarrow<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = ChildSectionNamePure<SN, CN> & SectionName;

export type ChildSectionName<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = ChildSectionNamePureWide<SN, CN> & SectionName;
function _testChildSectionName() {
  const unitName: ChildSectionNamePureWide<"property"> = "unit";
  // @ts-expect-error
  const error: ChildSectionNamePureWide<"property"> = "loan";
  const childName: ChildSectionName<"property" | "loan"> = "unit";
}

type ChildrenSectionNames = {
  [SN in SectionName]: ChildSectionName<SN>[];
};
export const childrenSectionNames = sectionNames.reduce((arrs, sectionName) => {
  const childNames = sectionToChildNames[sectionName];
  const child = childToSectionNames[sectionName] as {
    [key: string]: SectionName;
  };
  const types = childNames.map((childName) => child[childName]);
  (arrs[sectionName] as SectionName[]) = types;
  return arrs;
}, {} as ChildrenSectionNames);

type ChildSectionNamesToName = {
  [SN in SectionName]: {
    [CSN in ChildSectionName<SN>]: PropKeyOfValue<ChildToSectionName[SN], CSN>;
  };
};

export type ChildSectionNameName<
  SN extends SectionName,
  CSN extends SectionName // ChildSectionName<SN>
> = ChildSectionNamesToName[SN][CSN & keyof ChildSectionNamesToName[SN]] &
  ChildName<SN>;

function _testChildSectionNameName<
  SN extends "property" | "loan",
  CSN extends ChildSectionName<SN>
>(_sn: SN, _csn: CSN) {
  const _test1: ChildSectionNameName<"property", "ongoingListGroup"> =
    "ongoingCostListGroup";
  //@ts-expect-error
  const _test2: ChildSectionNameName<"property", "ongoingList"> = "ongoingList";
  const _test3: ChildSectionNameName<
    "property" | "loan",
    "singleTimeListGroup"
  > = "wrappedInLoanListGroup";
}
_testChildSectionNameName("property", "singleTimeListGroup");

export type ChildSectionNameToNameArrs = {
  [SN in SectionName]: {
    [CSN in ChildSectionName<SN>]: ChildSectionNameName<SN, CSN>[];
  };
};
export const sectionChildNameNames = sectionNames.reduce(
  (sectionChildNamesToNames, sectionName) => {
    const sectionNames = childrenSectionNames[sectionName] as string[];
    const namesToSectionName = childToSectionNames[sectionName] as {
      [key: string]: string;
    };

    (sectionChildNamesToNames as any)[sectionName] = sectionNames.reduce(
      (nameToNames, sn) => {
        nameToNames[sn] = Obj.propKeysOfValue(namesToSectionName, sn);
        return nameToNames;
      },
      {} as { [key: string]: string[] }
    );
    return sectionChildNamesToNames;
  },
  {} as ChildSectionNameToNameArrs
);

export type ChildSectionNameOrNull<
  SN extends SectionName,
  CN extends SectionName
> = Extract<ChildSectionNamePure<SN>, CN> extends never ? null : CN;

function testChildSectionNameOrNull() {
  const _test1: ChildSectionNameOrNull<"property", "loan"> = null;
  const _test2: ChildSectionNameOrNull<"property", "unit"> = "unit";
  //@ts-expect-error
  const _test3: ChildSectionNameOrNull<"property", "loan"> = "unit";
}
