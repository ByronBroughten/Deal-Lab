import { pick } from "lodash";
import { StateValue } from "../FeSections/FeSection/FeVarb/feValue";
import { DbVarbs } from "../SectionPack/RawSection";
import { sectionMetas } from "../SectionsMeta";
import { Id } from "../SectionsMeta/baseSections/id";
import { FeSectionInfo, VarbInfo } from "../SectionsMeta/Info";
import { VarbNames } from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { DbValue } from "../SectionsMeta/relSections/rel/valueMetaTypes";
import { ChildIdArrsNarrow } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { StrictPick, StrictPickPartial } from "../utils/types";
import { RawFeSection, RawFeVarb, RawFeVarbs } from "./StateSectionsNext";

type InitVarbs = Partial<DbVarbs>;
type InitChildIdArrs<SN extends SectionName> = Partial<ChildIdArrsNarrow<SN>>;
interface InitRawFeSectionProps<SN extends SectionName>
  extends StrictPick<RawFeSection<SN>, "sectionName" | "parentInfo">,
    StrictPickPartial<RawFeSection<SN>, "feId" | "dbId"> {
  dbVarbs?: InitVarbs;
  childFeIds?: InitChildIdArrs<SN>;
}

// there are no varbs
export function initRawSection<SN extends SectionName>({
  sectionName,
  feId = Id.make(),
  childFeIds = {},
  dbVarbs = {},
  ...rest
}: InitRawFeSectionProps<SN>): RawFeSection<SN> {
  return {
    ...rest,
    sectionName,
    feId,
    dbId: Id.make(),
    childFeIds: initChildFeIds(sectionName, childFeIds),
    varbs: initRawVarbs({
      sectionName,
      feId,
      dbVarbs,
    }),
  };
}

function initChildFeIds<SN extends SectionName>(
  sectionName: SN,
  proposed: Partial<ChildIdArrsNarrow<SN>> = {}
): ChildIdArrsNarrow<SN> {
  const sectionMeta = sectionMetas.section(sectionName, "fe");
  return {
    ...sectionMeta.emptyChildIdsNarrow(),
    ...pick(proposed, [sectionMeta.childNames as any]),
  } as ChildIdArrsNarrow<SN>;
}

interface InitRawVarbsProps<SN extends SectionName> extends FeSectionInfo<SN> {
  dbVarbs: InitVarbs;
}

export function initRawVarbs<SN extends SectionName>({
  dbVarbs,
  ...feSectionInfo
}: InitRawVarbsProps<SN>): RawFeVarbs<SN> {
  const { sectionName } = feSectionInfo;
  const { varbNames } = sectionMetas.section(sectionName);
  return varbNames.reduce((varbs, varbName) => {
    varbs[varbName] = initRawVarb({
      ...feSectionInfo,
      ...(varbName in dbVarbs ? { dbVarb: dbVarbs[varbName] } : {}),
      varbName,
    });
    return varbs;
  }, {} as RawFeVarbs<SN>);
}

interface InitRawVarbProps<SN extends SectionName> extends VarbInfo<SN> {
  dbVarb?: DbValue;
}
function initRawVarb<SN extends SectionName>({
  dbVarb,
  ...rest
}: InitRawVarbProps<SN>): RawFeVarb<SN> {
  return {
    value: dbToFeValue({ ...rest, sectionContext: "fe" }, dbVarb),
    manualUpdateEditorToggle: undefined,
    outEntities: [],
  };
}
function dbToFeValue(
  varbNames: VarbNames<SectionName>,
  proposedDbValue: DbValue | undefined
) {
  const dbValue = getValidDbValue(varbNames, proposedDbValue);
  const valueMeta = sectionMetas.value(varbNames, "fe");
  const value = (valueMeta.rawToState as (_: DbValue) => StateValue)(dbValue);
  return value;
}
function getValidDbValue(
  varbNames: VarbNames<SectionName>,
  dbValue: DbValue | undefined
): DbValue {
  const valueMeta = sectionMetas.value(varbNames, "fe");
  const varbMeta = sectionMetas.varb(varbNames);
  // for now, the correct dbInitValue lies on varbMeta
  // not valueMeta
  return valueMeta.isRaw(dbValue) ? dbValue : (varbMeta.dbInitValue as DbValue);
}
