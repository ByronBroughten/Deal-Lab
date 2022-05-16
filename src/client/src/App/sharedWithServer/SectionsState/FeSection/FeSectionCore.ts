import { pick } from "lodash";
import { DbVarbs } from "../../Analyzer/SectionPackRaw/RawSection";
import { sectionMetas } from "../../SectionsMeta";
import { Id } from "../../SectionsMeta/baseSections/id";
import { FeParentInfo } from "../../SectionsMeta/Info";
import { ChildIdArrsNarrow } from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { FeVarbsI, initFeVarbs } from "./FeVarbs";

export class HasFeSectionCore<SN extends SectionName> {
  constructor(readonly core: FeSectionCore<SN>) {}
}

export type FeSectionCore<SN extends SectionName> = {
  sectionName: SN;
  parentInfo: FeParentInfo<SN>;
  childFeIds: ChildIdArrsNarrow<SN>;
  feId: string;
  dbId: string;
  varbs: FeVarbsI<SN>;
};

export interface InitFeSectionCoreProps<SN extends SectionName> {
  sectionName: SN;
  parentInfo: FeParentInfo<SN>;
  childFeIds?: Partial<ChildIdArrsNarrow<SN>>;
  feId?: string;
  dbId?: string;
  dbVarbs?: Partial<DbVarbs>;
}
// there are no varbs
export function initFeSectionCore<SN extends SectionName>({
  sectionName,
  feId = Id.make(),
  childFeIds = {},
  dbVarbs = {},
  ...rest
}: InitFeSectionCoreProps<SN>): FeSectionCore<SN> {
  return {
    ...rest,
    sectionName,
    feId,
    dbId: Id.make(),
    childFeIds: initChildFeIds(sectionName, childFeIds),
    varbs: initFeVarbs({
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
