import { Arr } from "../utils/Arr";
import { Merge } from "../utils/Obj/merge";
import {
  ChildName,
  sectionToChildNames,
} from "./childSectionsDerived/ChildName";
import { ChildSectionNameName } from "./childSectionsDerived/ChildSectionName";
import { dbStoreNames } from "./childSectionsDerived/DbStoreName";
import { FeStoreName } from "./relSectionsDerived/relNameArrs/feStoreNameArrs";
import { SectionName, sectionNames } from "./SectionName";

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
  dbIndexName: TableRowDbSource | null;
};
type GenericRelChildren<SN extends SectionName> = {
  [CN in ChildName<SN>]: GeneralRelChild;
};

type DefaultRelChildren<SN extends SectionName> = {
  [CN in ChildName<SN>]: DefaultRelChild;
};

function makeDefaultRelChild<RC extends GeneralRelChild>(rc: RC): RC {
  return rc;
}
const defaultRelChild = makeDefaultRelChild({
  feTableRowStore: null,
  dbIndexName: null,
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

function makeDefaultRelChildren<SN extends SectionName>(
  sectionName: SN
): DefaultRelChildren<SN> {
  const childNames = sectionToChildNames[sectionName] as ChildName<SN>[];
  return childNames.reduce((defaults, childName) => {
    defaults[childName] = defaultRelChild;
    return defaults;
  }, {} as DefaultRelChildren<SN>);
}
type DefaultRelChildSections = {
  [SN in SectionName]: DefaultRelChildren<SN>;
};
function makeDefaultRelChildSections(): DefaultRelChildSections {
  return sectionNames.reduce((defaults, sectionName) => {
    defaults[sectionName] = makeDefaultRelChildren(sectionName);
    return defaults;
  }, {} as DefaultRelChildSections);
}

function relChildren<
  SN extends SectionName,
  RC extends Partial<GenericRelChildren<SN>>
>(sectionName: SN, children: RC): Merge<DefaultRelChildren<SN>, RC> {
  return {
    ...makeDefaultRelChildren(sectionName),
    ...children,
  } as any as Merge<DefaultRelChildren<SN>, RC>;
}

type GenericRelChildSections = {
  [SN in SectionName]: GenericRelChildren<SN>;
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

export const relChildSections = makeRelChildSections({
  ...makeDefaultRelChildSections(),
  feUser: relChildren("feUser", {
    propertyDisplayStore: relChild({
      dbIndexName: "propertyMain",
    }),
    loanDisplayStore: relChild({
      dbIndexName: "loanMain",
    }),
    mgmtDisplayStore: relChild({
      dbIndexName: "mgmtMain",
    }),
    dealDisplayStore: relChild({
      dbIndexName: "dealMain",
    }),

    dealMainTable: relChild({
      dbIndexName: "dealMain",
    }),
    propertyMainTable: relChild({
      dbIndexName: "propertyMain",
    }),
    loanMainTable: relChild({
      dbIndexName: "loanMain",
    }),
    mgmtMainTable: relChild({
      dbIndexName: "mgmtMain",
    }),
  }),
});

type RelChildSections = typeof relChildSections;

export type FeUserDbIndex<SN extends FeStoreName> =
  RelChildSections["feUser"][SN]["dbIndexName"];
