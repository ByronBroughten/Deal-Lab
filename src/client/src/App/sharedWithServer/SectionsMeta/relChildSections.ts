import { Arr } from "../utils/Arr";
import { Merge } from "../utils/Obj/merge";
import { SimpleSectionName, simpleSectionNames } from "./baseSections";
import {
  ChildName,
  sectionToChildNames,
} from "./childSectionsDerived/ChildName";
import { ChildSectionNameName } from "./childSectionsDerived/ChildSectionName";
import { dbStoreNames } from "./childSectionsDerived/DbStoreName";

export const tableRowDbSources = Arr.extractStrict(dbStoreNames, [
  "mgmtMain",
  "loanMain",
  "propertyMain",
  "dealMain",
] as const);
export const displayNameDbSources = tableRowDbSources;

type TableRowDbSource = typeof tableRowDbSources[number];

type GeneralRelChild = {
  feTableRowStore: ChildSectionNameName<"feUser", "compareTable"> | null;
  partialIndexDbSource: TableRowDbSource | null;
};
type GenericRelChildren<SN extends SimpleSectionName> = {
  [CN in ChildName<SN>]: GeneralRelChild;
};

type DefaultRelChildren<SN extends SimpleSectionName> = {
  [CN in ChildName<SN>]: DefaultRelChild;
};

function makeDefaultRelChild<RC extends GeneralRelChild>(rc: RC): RC {
  return rc;
}
const defaultRelChild = makeDefaultRelChild({
  feTableRowStore: null,
  partialIndexDbSource: null,
});
type DefaultRelChild = typeof defaultRelChild;

function relChild<RC extends Partial<GeneralRelChild>>(
  relChild: RC
): Merge<DefaultRelChild, RC> {
  return {
    ...defaultRelChild,
    ...relChild,
  } as any;
}

function makeDefaultRelChildren<SN extends SimpleSectionName>(
  sectionName: SN
): DefaultRelChildren<SN> {
  const childNames = sectionToChildNames[sectionName] as ChildName<SN>[];
  return childNames.reduce((defaults, childName) => {
    defaults[childName] = defaultRelChild;
    return defaults;
  }, {} as DefaultRelChildren<SN>);
}
type DefaultRelChildSections = {
  [SN in SimpleSectionName]: DefaultRelChildren<SN>;
};
function makeDefaultRelChildSections(): DefaultRelChildSections {
  return simpleSectionNames.reduce((defaults, sectionName) => {
    defaults[sectionName] = makeDefaultRelChildren(sectionName);
    return defaults;
  }, {} as DefaultRelChildSections);
}

function relChildren<
  SN extends SimpleSectionName,
  RC extends Partial<GenericRelChildren<SN>>
>(sectionName: SN, children: RC): Merge<DefaultRelChildren<SN>, RC> {
  return {
    ...makeDefaultRelChildren(sectionName),
    ...children,
  } as any as Merge<DefaultRelChildren<SN>, RC>;
}

type GenericRelChildSections = {
  [SN in SimpleSectionName]: GenericRelChildren<SN>;
};
function makeRelChildSections<RCS extends GenericRelChildSections>(
  rcs: RCS
): RCS {
  return rcs;
}

export const feStoreTableNames: ChildSectionNameName<
  "feUser",
  "compareTable"
>[] = ["propertyMainTable", "loanMainTable", "mgmtMainTable", "dealMainTable"];
export type FeUserTableName = typeof feStoreTableNames[number];
export function isFeUserTableName(value: any): value is FeUserTableName {
  return feStoreTableNames.includes(value);
}

export const feUserNameListNames: ChildSectionNameName<
  "feUser",
  "displayNameList"
>[] = ["dealNames", "propertyNames", "mgmtNames", "loanNames"];
export type FeUserDisplayListName = typeof feUserNameListNames[number];
export function isFeUserDisplayListName(
  value: any
): value is FeUserDisplayListName {
  return feUserNameListNames.includes(value);
}

export const relChildSections = makeRelChildSections({
  ...makeDefaultRelChildSections(),
  feUser: relChildren("feUser", {
    propertyNames: relChild({
      partialIndexDbSource: "propertyMain",
    }),
    loanNames: relChild({
      partialIndexDbSource: "loanMain",
    }),
    mgmtNames: relChild({
      partialIndexDbSource: "mgmtMain",
    }),
    dealNames: relChild({
      partialIndexDbSource: "dealMain",
    }),

    dealMainTable: relChild({
      partialIndexDbSource: "dealMain",
    }),
    propertyMainTable: relChild({
      partialIndexDbSource: "propertyMain",
    }),
    loanMainTable: relChild({
      partialIndexDbSource: "loanMain",
    }),
    mgmtMainTable: relChild({
      partialIndexDbSource: "mgmtMain",
    }),
  }),
});

type RelChildSections = typeof relChildSections;
