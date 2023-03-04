import { pick } from "lodash";
import { sectionsMeta } from "../SectionsMeta";
import { Id } from "../SectionsMeta/id";
import { ChildIdArrsNarrow } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { VarbNames } from "../SectionsMeta/SectionInfo/VarbInfoBase";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionValues, StateValue } from "../SectionsMeta/values/StateValue";
import { StrictPick, StrictPickPartial } from "../utils/types";
import { RawFeSection, StateVarb, StateVarbs } from "./StateSectionsTypes";

type InitVarbs<SN extends SectionName> = Partial<SectionValues<SN>>;

type InitChildIdArrs<SN extends SectionName> = Partial<ChildIdArrsNarrow<SN>>;
export interface InitRawFeSectionProps<SN extends SectionName>
  extends StrictPick<RawFeSection<SN>, "sectionName">,
    StrictPickPartial<
      RawFeSection<SN>,
      "feId" | "dbId" | "sectionContextName" | "contextPathIdxSpecifier"
    > {
  dbVarbs?: InitVarbs<SN>;
  childFeIds?: InitChildIdArrs<SN>;
}

export function initRawSection<SN extends SectionName>({
  sectionName,
  sectionContextName = "default",
  contextPathIdxSpecifier = {},
  feId = Id.make(),
  dbId = Id.make(),
  childFeIds = {},
  dbVarbs = {},
}: InitRawFeSectionProps<SN>): RawFeSection<SN> {
  return {
    contextPathIdxSpecifier,
    sectionContextName,
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
  dbVarbs: InitVarbs<SN>;
}

export function initRawVarbs<SN extends SectionName>({
  dbVarbs,
  ...feSectionInfo
}: InitRawVarbsProps<SN>): StateVarbs<SN> {
  const { sectionName } = feSectionInfo;
  const { varbNames } = sectionsMeta.section(sectionName);
  return varbNames.reduce((varbs, varbName) => {
    varbs[varbName] = initRawVarb({
      ...feSectionInfo,
      ...(varbName in dbVarbs ? { dbVarb: (dbVarbs as any)[varbName] } : {}),
      varbName,
    });
    return varbs;
  }, {} as StateVarbs<SN>);
}

interface InitRawVarbProps<SN extends SectionName> extends FeVarbInfo<SN> {
  dbVarb?: StateValue;
}
function initRawVarb<SN extends SectionName>({
  dbVarb,
  ...rest
}: InitRawVarbProps<SN>): StateVarb<SN> {
  return {
    value: dbToFeValue(rest, dbVarb),
    outEntities: [],
    isPureUserVarb: false,
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
  const valueMetas = sectionsMeta.value(varbNames);
  const varbMeta = sectionsMeta.varb(varbNames);
  return valueMetas.is(dbValue) ? dbValue : varbMeta.initValue;
}
