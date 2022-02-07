import Analyzer from "../../../../Analyzer";
import Arr from "../../../../utils/Arr";
import { sectionMetas } from "../../../SectionMetas";
import { DbEntry, DbSection } from "../../../DbEntry";
import { Inf } from "../../../SectionMetas/Info";
import { FeParentInfo } from "../../../SectionMetas/relSectionTypes";
import { SectionNam, SectionName } from "../../../SectionMetas/SectionName";
import { VarbValues } from "../../../StateSection/methods/varbs";
import { initValuesFromDb } from "./gatherSectionInitProps/initValuesFromDb";
import { saneInitialSections } from "./gatherSectionInitProps/saneInitialSections";
import { InitOneSectionProps } from "./initOneSection";

type BaseSectionProps<S extends SectionName> = {
  sectionName: S;
  parentInfo: FeParentInfo<S>;
  feId: string;
  idx?: number;
};
function gatherInitPropsFromDbEntry<S extends SectionName>(
  analyzer: Analyzer,
  propArr: InitOneSectionProps<S>[],
  baseSectionProps: BaseSectionProps<S>,
  dbEntry: DbEntry,
  initFromDefault: boolean | undefined
) {
  const { sectionName, feId } = baseSectionProps;
  const feInfo = Inf.fe(sectionName, feId);
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
  propArr.push({
    ...baseSectionProps,
    options: {
      dbId,
      values: initValuesFromDb(sectionName, dbSection.dbVarbs),
    },
  });

  const sectionMeta = analyzer.meta.get(sectionName);
  const { childDbIds } = dbSection;
  for (const childName of sectionMeta.childSectionNames) {
    if (childName in childDbIds) {
      for (const dbId of childDbIds[childName]) {
        const dbEntry: DbEntry = { dbId, dbSections };
        gatherSectionInitProps(analyzer, {
          sectionName: childName,
          parentInfo: feInfo as FeParentInfo<typeof childName>,
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
  const feInfo = Inf.fe(sectionName, feId);
  const sectionMeta = analyzer.meta.get(sectionName);
  propArr.push({
    ...baseSectionProps,
    options: { values },
  });
  for (const childName of sectionMeta.childSectionNames) {
    const childMeta = sectionMetas.get(childName);
    if (!childMeta.makeOneOnStartup) continue;

    if ("initBunch" in childMeta) {
      // for (const values of childMeta.initBunch) {
      //   this.gatherSectionInitProps(childName, feInfo, { values, propArr });
      // }
    } else {
      gatherSectionInitProps(analyzer, {
        sectionName: childName,
        parentInfo: feInfo as FeParentInfo<typeof childName>,
        propArr,
        initFromDefault,
      });
    }
  }
}

export type GatherSectionInitPropsProps<S extends SectionName> = {
  sectionName: S;
  parentInfo: FeParentInfo<S>;

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
    parentInfo,
    propArr = [],
    dbEntry,
    values = {},
    idx,
    initFromDefault = true,
  }: GatherSectionInitPropsProps<S>
): InitOneSectionProps[] {
  if (!initFromDefault && !dbEntry && saneInitialSections.isIn(sectionName)) {
    dbEntry = saneInitialSections.get(sectionName);
  }

  if (initFromDefault && SectionNam.is(sectionName, "hasDefaultStore")) {
    const storeName = analyzer.meta.get(sectionName).defaultStoreName;
    dbEntry = analyzer.toDbEntry(storeName, {
      newMainSectionName: sectionName,
    });
  }

  const feId = Analyzer.makeId();
  const basicProps: BaseSectionProps<S> = {
    sectionName,
    parentInfo,
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
