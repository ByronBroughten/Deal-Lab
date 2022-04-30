import Analyzer from "../../../../Analyzer";
import { sectionMetas } from "../../../../SectionMetas";
import { InfoS } from "../../../../SectionMetas/Info";
import {
  FeParentInfo,
  ParentFinder,
} from "../../../../SectionMetas/relSectionTypes/ParentTypes";
import {
  SectionName,
  sectionNameS,
} from "../../../../SectionMetas/SectionName";
import Arr from "../../../../utils/Arr";
import { DbEntry, DbSection } from "../../../DbEntry";
import { VarbValues } from "../../../StateSection/methods/varbs";
import { initValuesFromDb } from "./gatherSectionInitProps/initValuesFromDb";
import { saneInitialSections } from "./gatherSectionInitProps/saneInitialSections";
import { InitOneSectionProps } from "./initOneSection";

type BaseSectionProps<SN extends SectionName> = {
  sectionName: SN;
  parentFinder: ParentFinder<SN>;
  feId: string;
  idx?: number;
};
function gatherInitPropsFromDbEntry<SN extends SectionName>(
  analyzer: Analyzer,
  propArr: InitOneSectionProps<SN>[],
  baseSectionProps: BaseSectionProps<SN>,
  dbEntry: DbEntry,
  initFromDefault: boolean | undefined
) {
  const { sectionName, feId } = baseSectionProps;
  const feInfo = InfoS.fe(sectionName, feId);
  const { dbId, dbSections } = dbEntry;
  const dbSectionArr = dbSections[sectionName];

  if (dbSectionArr === undefined) {
    throw new Error(`sectionName ${sectionName} not in dbEntry.dbSections`);
  }
  const dbSection = Arr.findIn(
    dbSectionArr as DbSection[],
    (dbSection) => dbSection.dbId === dbId
  ); // I may need to alter this to address that there are multiple outputs.
  if (!dbSection) return undefined;

  const { parentFinder, ...rest } = baseSectionProps;
  propArr.push({
    ...{
      parentInfo: analyzer.parentFinderToInfo(
        parentFinder,
        baseSectionProps.sectionName
      ),
      ...rest,
    },
    options: {
      dbId,
      values: initValuesFromDb(sectionName, dbSection.dbVarbs),
    },
  });

  const sectionMeta = analyzer.meta.section(sectionName);
  const { childDbIds } = dbSection;
  for (const childName of sectionMeta.get("childNames")) {
    if (childName in childDbIds) {
      for (const dbId of childDbIds[childName]) {
        const dbEntry: DbEntry = { dbId, dbSections };
        gatherSectionInitProps(analyzer, {
          sectionName: childName,
          parentFinder: feInfo as FeParentInfo<typeof childName>,
          propArr,
          dbEntry,
          initFromDefault,
        });
      }
    }
  }
}

function gatherInitPropsByDefault<S extends SectionName>(
  analyzer: Analyzer,
  propArr: InitOneSectionProps<S>[],
  baseSectionProps: BaseSectionProps<S>,
  values: VarbValues,
  initFromDefault: boolean | undefined
) {
  const { sectionName, feId } = baseSectionProps;
  const feInfo = InfoS.fe(sectionName, feId);
  const sectionMeta = analyzer.meta.get(sectionName);

  const { parentFinder, ...rest } = baseSectionProps;
  propArr.push({
    ...rest,
    parentInfo: analyzer.parentFinderToInfo(
      parentFinder,
      baseSectionProps.sectionName
    ),
    options: { values },
  });
  for (const childName of sectionMeta.get("childNames")) {
    const childMeta = sectionMetas.section(childName);
    if (!childMeta.get("makeOneOnStartup")) continue;

    if ("initBunch" in childMeta) {
      // for (const values of childMeta.initBunch) {
      //   this.gatherSectionInitProps(childName, feInfo, { values, propArr });
      // }
    } else {
      gatherSectionInitProps(analyzer, {
        sectionName: childName,
        parentFinder: feInfo as FeParentInfo<typeof childName>,
        propArr,
        initFromDefault,
      });
    }
  }
}

export type GatherSectionInitPropsProps<SN extends SectionName> = {
  sectionName: SN;
  parentFinder: ParentFinder<SN>;

  propArr?: InitOneSectionProps[];
  values?: VarbValues;
  dbEntry?: DbEntry;
  idx?: number;
  initFromDefault?: boolean;
};
export function gatherSectionInitProps<S extends SectionName>(
  analyzer: Analyzer,
  {
    sectionName,
    parentFinder,
    propArr = [],
    dbEntry,
    values = {},
    idx,
    initFromDefault = true,
  }: GatherSectionInitPropsProps<S>
): InitOneSectionProps[] {
  if (!dbEntry) {
    if (!initFromDefault && saneInitialSections.isIn(sectionName)) {
      dbEntry = saneInitialSections.get(sectionName);
    }
    if (initFromDefault && sectionNameS.is(sectionName, "hasDefaultStore")) {
      const storeName = analyzer.meta
        .section(sectionName)
        .get("defaultStoreName");
      dbEntry = analyzer.dbEntry(storeName, {
        newMainSectionName: sectionName,
      });
    }
  }

  const feId = Analyzer.makeId();
  const basicProps: BaseSectionProps<S> = {
    sectionName,
    parentFinder,
    feId,
    ...(idx ? { idx } : undefined),
  };
  if (dbEntry)
    gatherInitPropsFromDbEntry(
      analyzer,
      propArr,
      basicProps,
      dbEntry,
      initFromDefault
    );
  else
    gatherInitPropsByDefault(
      analyzer,
      propArr,
      basicProps,
      values,
      initFromDefault
    );
  return propArr;
}
