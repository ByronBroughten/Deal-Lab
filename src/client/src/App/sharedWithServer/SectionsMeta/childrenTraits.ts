import { Arr } from "../utils/Arr";
import { Merge } from "../utils/Obj/merge";
import { FeStoreName } from "./relSectionsDerived/FeStoreName";
import {
  ChildName,
  sectionToChildNames,
} from "./sectionChildrenDerived/ChildName";
import { ChildSectionNameName } from "./sectionChildrenDerived/ChildSectionName";
import { dbStoreNames } from "./sectionChildrenDerived/DbStoreName";
import { SectionName, sectionNames } from "./SectionName";
import { SectionPathContextName } from "./sectionPathContexts";

export const tableRowDbSources = Arr.extractStrict(dbStoreNames, [
  "mgmtMain",
  "loanMain",
  "propertyMain",
  "dealMain",
] as const);
export const displayNameDbSources = tableRowDbSources;

type TableRowDbSource = typeof tableRowDbSources[number];

export type GenericChildTraits = {
  feTableRowStore: ChildSectionNameName<"feUser", "compareTable"> | null;
  dbIndexName: TableRowDbSource | null;
  sectionContextName: SectionPathContextName | null;
};
type GenericChildrenTraits<SN extends SectionName> = {
  [CN in ChildName<SN>]: GenericChildTraits;
};

type DefaultChildrenTraits<SN extends SectionName> = {
  [CN in ChildName<SN>]: DefaultRelChild;
};

function makeDefaultChildTraits<RC extends GenericChildTraits>(rc: RC): RC {
  return rc;
}
const defaultRelChild = makeDefaultChildTraits({
  feTableRowStore: null,
  dbIndexName: null,
  sectionContextName: null,
});
type DefaultRelChild = typeof defaultRelChild;

function childTraits<RC extends Partial<GenericChildTraits>>(
  childTraits: RC
): Merge<DefaultRelChild, RC> {
  return {
    ...defaultRelChild,
    ...childTraits,
  } as any;
}

function makeDefaultChildrenTraits<SN extends SectionName>(
  sectionName: SN
): DefaultChildrenTraits<SN> {
  const childNames = sectionToChildNames[sectionName] as ChildName<SN>[];
  return childNames.reduce((defaults, childName) => {
    defaults[childName] = defaultRelChild;
    return defaults;
  }, {} as DefaultChildrenTraits<SN>);
}
type DefaultRelChildSections = {
  [SN in SectionName]: DefaultChildrenTraits<SN>;
};
function makeDefaultAllChildrenTraits(): DefaultRelChildSections {
  return sectionNames.reduce((defaults, sectionName) => {
    defaults[sectionName] = makeDefaultChildrenTraits(sectionName);
    return defaults;
  }, {} as DefaultRelChildSections);
}

function childrenTraits<
  SN extends SectionName,
  RC extends Partial<GenericChildrenTraits<SN>>
>(sectionName: SN, children: RC): Merge<DefaultChildrenTraits<SN>, RC> {
  return {
    ...makeDefaultChildrenTraits(sectionName),
    ...children,
  } as any as Merge<DefaultChildrenTraits<SN>, RC>;
}

type GenericAllChildrenTraits = {
  [SN in SectionName]: GenericChildrenTraits<SN>;
};
function checkAllChildrenTraits<RCS extends GenericAllChildrenTraits>(
  rcs: RCS
): RCS {
  return rcs;
}

export const allChildrenTraits = checkAllChildrenTraits({
  ...makeDefaultAllChildrenTraits(),
  main: childrenTraits("main", {
    activeDealPage: childTraits({
      sectionContextName: "activeDealPage",
    }),
    userVarbEditor: childTraits({
      sectionContextName: "userVarbEditorPage",
    }),
    userListEditor: childTraits({
      sectionContextName: "userListEditorPage",
    }),
    latentSections: childTraits({
      sectionContextName: "latentSection",
    }),
  }),
  feUser: childrenTraits("feUser", {
    dealMainTable: childTraits({
      dbIndexName: "dealMain",
    }),
    propertyMainTable: childTraits({
      dbIndexName: "propertyMain",
    }),
    loanMainTable: childTraits({
      dbIndexName: "loanMain",
    }),
    mgmtMainTable: childTraits({
      dbIndexName: "mgmtMain",
    }),
    dealMain: childTraits({
      sectionContextName: "latentSection",
    }),
    propertyMain: childTraits({
      sectionContextName: "latentSection",
    }),
    mgmtMain: childTraits({
      sectionContextName: "latentSection",
    }),
    loanMain: childTraits({
      sectionContextName: "latentSection",
    }),
    outputListMain: childTraits({
      sectionContextName: "activeDealPage",
    }),
    userVarbListMain: childTraits({
      sectionContextName: "activeDealPage",
    }),
    singleTimeListMain: childTraits({
      sectionContextName: "activeDealPage",
    }),
    ongoingListMain: childTraits({
      sectionContextName: "activeDealPage",
    }),
  }),
});

type AllChildrenTraits = typeof allChildrenTraits;
export type ChildrenTraits<SN extends SectionName> = AllChildrenTraits[SN];

export type ChildTraits<
  SN extends SectionName,
  CN extends ChildName<SN>
> = ChildrenTraits<SN>[CN & keyof ChildrenTraits<SN>];

export type FeUserDbIndex<CN extends FeStoreName> =
  ChildrenTraits<"feUser">[CN]["dbIndexName"];
