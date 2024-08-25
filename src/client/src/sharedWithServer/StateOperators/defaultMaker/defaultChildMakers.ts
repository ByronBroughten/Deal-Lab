import { ChildName } from "../../stateSchemas/derivedFromChildrenSchemas/ChildName";
import { ChildSectionName } from "../../stateSchemas/derivedFromChildrenSchemas/ChildSectionName";
import { SectionName } from "../../stateSchemas/SectionName";
import { SectionPack } from "../../StateTransports/SectionPack";
import { Obj } from "../../utils/Obj";
import { UpdaterSection } from "../Updaters/UpdaterSection";
import { makeDefaultLoanPack } from "./makeDefaultLoanPack";
import { makeDefaultActiveDealSystem } from "./makeDefaultMainActiveDeal";
import { makeDefaultProperty } from "./makeDefaultProperty";

export const childDefaultMakers = checkMakers({
  main: {
    activeDealSystem: (_) => makeDefaultActiveDealSystem(),
  },
  deal: {
    property: (deal) => {
      return makeDefaultProperty(deal.get.valueNext("dealMode"));
    },
  },
  financing: {
    loan: (financing) => {
      return makeDefaultLoanPack(financing.get.valueNext("financingMode"));
    },
  },
});

export function hasDefaultChild<S extends SectionName, CN extends ChildName<S>>(
  sectionName: S,
  childName: CN
) {
  if (Obj.isKey(childDefaultMakers, sectionName)) {
    const childMakers = childDefaultMakers[sectionName];
    if (Obj.isKey(childMakers, childName)) {
      return true;
    }
  }
}

export function makeDefaultChildPack<
  SN extends SectionName,
  CN extends ChildName<SN>
>(
  updater: UpdaterSection<SN>,
  childName: CN
): SectionPack<ChildSectionName<SN, CN>> {
  const { sectionName } = updater;
  if (Obj.isKey(childDefaultMakers, sectionName)) {
    const childMakers = childDefaultMakers[sectionName];
    if (Obj.isKey(childMakers, childName)) {
      const childMaker = childMakers[childName] as ChildMaker<
        any,
        any
      > as ChildMaker<SN, CN>;
      return childMaker(updater);
    }
  }
  throw new Error(
    `There is no default child sectionPack for ${sectionName}.${childName}`
  );
}

type ChildMaker<SN extends SectionName, CN extends ChildName<SN>> = (
  updater: UpdaterSection<SN>
) => SectionPack<ChildSectionName<SN, CN>>;

type DefaultMakers = Partial<{
  [SN in SectionName]: Partial<{
    [CN in ChildName<SN>]: ChildMaker<SN, CN>;
  }>;
}>;

function checkMakers<T extends DefaultMakers>(t: T) {
  return t;
}
