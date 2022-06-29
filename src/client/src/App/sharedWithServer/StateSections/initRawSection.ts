import { pick } from "lodash";
import { DbVarbs } from "../SectionPack/RawSection";
import { sectionsMeta } from "../SectionsMeta";
import { VarbNames } from "../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import { StateValue } from "../SectionsMeta/baseSectionsUtils/baseValues/StateValueTypes";
import { Id } from "../SectionsMeta/baseSectionsUtils/id";
import { ChildIdArrsNarrow } from "../SectionsMeta/childSectionsDerived/ChildTypes";
import { FeSectionInfo, VarbInfo } from "../SectionsMeta/Info";
import { DbValue } from "../SectionsMeta/relSectionsUtils/rel/valueMetaTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { StrictPick, StrictPickPartial } from "../utils/types";
import { RawFeSection, RawFeVarb, RawFeVarbs } from "./StateSectionsTypes";

type InitVarbs = Partial<DbVarbs>;
type InitChildIdArrs<SN extends SectionName> = Partial<ChildIdArrsNarrow<SN>>;
export interface InitRawFeSectionProps<SN extends SectionName>
  extends StrictPick<RawFeSection<SN>, "sectionName">,
    StrictPickPartial<RawFeSection<SN>, "feId" | "dbId"> {
  dbVarbs?: InitVarbs;
  childFeIds?: InitChildIdArrs<SN>;
}

// there are no varbs
export function initRawSection<SN extends SectionName>({
  sectionName,
  feId = Id.make(),
  dbId = Id.make(),
  childFeIds = {},
  dbVarbs = {},
}: InitRawFeSectionProps<SN>): RawFeSection<SN> {
  return {
    sectionName,
    feId,
    dbId,
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
  const sectionMeta = sectionsMeta.section(sectionName);
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
  const { varbNames } = sectionsMeta.section(sectionName);
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
    value: dbToFeValue(rest, dbVarb),
    manualUpdateEditorToggle: undefined,
    outEntities: [],
  };
}
function dbToFeValue(
  varbNames: VarbNames<SectionName>,
  proposedDbValue: StateValue | undefined
) {
  const dbValue = getValidValue(varbNames, proposedDbValue);
  return dbValue;
}
function getValidValue(
  varbNames: VarbNames<SectionName>,
  dbValue: StateValue | undefined
): StateValue {
  const valueMeta = sectionsMeta.value(varbNames);
  const varbMeta = sectionsMeta.varb(varbNames);
  return valueMeta.is(dbValue) ? dbValue : varbMeta.initValue;
}
