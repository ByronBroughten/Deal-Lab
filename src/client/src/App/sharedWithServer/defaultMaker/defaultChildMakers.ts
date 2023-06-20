import { ChildName } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionName } from "../SectionsMeta/SectionName";
import { UpdaterSection } from "../StateUpdaters/UpdaterSection";
import { Obj } from "../utils/Obj";
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
