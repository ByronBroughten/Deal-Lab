import { pick } from "lodash";
import { sectionsMeta } from "../SectionsMeta";
import { VarbNames } from "../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import {
  DbValue,
  SectionValues,
} from "../SectionsMeta/baseSectionsDerived/valueMetaTypes";
import { StateValue } from "../SectionsMeta/baseSectionsVarbs/baseValues/StateValueTypes";
import { Id } from "../SectionsMeta/baseSectionsVarbs/id";
import { ChildIdArrsNarrow } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { StrictPick, StrictPickPartial } from "../utils/types";
import { RawFeSection, StateVarb, StateVarbs } from "./StateSectionsTypes";

type InitVarbs<SN extends SectionName> = Partial<SectionValues<SN>>;

type InitChildIdArrs<SN extends SectionNameByType> = Partial<
  ChildIdArrsNarrow<SN>
>;
export interface InitRawFeSectionProps<SN extends SectionNameByType>
  extends StrictPick<RawFeSection<SN>, "sectionName">,
    StrictPickPartial<
      RawFeSection<SN>,
      "feId" | "dbId" | "sectionContextName"
    > {
  dbVarbs?: InitVarbs<SN>;
  childFeIds?: InitChildIdArrs<SN>;
}

// there are no varbs
export function initRawSection<SN extends SectionNameByType>({
  sectionName,
  sectionContextName = "default",
  feId = Id.make(),
  dbId = Id.make(),
  childFeIds = {},
  dbVarbs = {},
}: InitRawFeSectionProps<SN>): RawFeSection<SN> {
  return {
    sectionName,
    sectionContextName,
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

function initChildFeIds<SN extends SectionNameByType>(
  sectionName: SN,
  proposed: Partial<ChildIdArrsNarrow<SN>> = {}
): ChildIdArrsNarrow<SN> {
  const sectionMeta = sectionsMeta.section(sectionName);
  return {
    ...sectionMeta.emptyChildIdsNarrow(),
    ...pick(proposed, [sectionMeta.childNames as any]),
  } as ChildIdArrsNarrow<SN>;
}

interface InitRawVarbsProps<SN extends SectionNameByType>
  extends FeSectionInfo<SN> {
  dbVarbs: InitVarbs<SN>;
}

export function initRawVarbs<SN extends SectionNameByType>({
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

interface InitRawVarbProps<SN extends SectionNameByType>
  extends FeVarbInfo<SN> {
  dbVarb?: DbValue;
}
function initRawVarb<SN extends SectionNameByType>({
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
  varbNames: VarbNames<SectionNameByType>,
  proposedDbValue: StateValue | undefined
) {
  const dbValue = getValidValue(varbNames, proposedDbValue);
  return dbValue;
}
function getValidValue(
  varbNames: VarbNames<SectionNameByType>,
  dbValue: StateValue | undefined
): StateValue {
  const valueMetas = sectionsMeta.value(varbNames);
  const varbMeta = sectionsMeta.varb(varbNames);
  return valueMetas.is(dbValue) ? dbValue : varbMeta.initValue;
}
