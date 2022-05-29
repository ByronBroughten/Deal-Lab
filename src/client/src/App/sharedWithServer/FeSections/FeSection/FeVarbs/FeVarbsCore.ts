import { pick } from "lodash";
import { DbVarbs } from "../../../Analyzer/SectionPackRaw/RawSection";
import { sectionMetas } from "../../../SectionsMeta";
import { FeSectionInfo } from "../../../SectionsMeta/Info";
import { SectionName } from "../../../SectionsMeta/SectionName";
import FeVarb from "../FeVarb";

export interface FeVarbsCore<SN extends SectionName> extends FeSectionInfo<SN> {
  varbs: FeVarbsInner<SN>;
}

export type FeVarbsInner<SN extends SectionName> = {
  [key: string]: FeVarb<SN & SectionName<"hasVarb">>;
};

export function initFeVarbsCore<SN extends SectionName>(
  props: InitFeVarbsCoreProps<SN>
): FeVarbsCore<SN> {
  return {
    ...pick(props, ["sectionName", "feId"]),
    varbs: initFeVarbsInner(props),
  };
}

export interface InitFeVarbsCoreProps<SN extends SectionName>
  extends FeSectionInfo<SN> {
  dbVarbs: Partial<DbVarbs>;
}

function initFeVarbsInner<SN extends SectionName>({
  dbVarbs,
  sectionName,
  feId,
}: InitFeVarbsCoreProps<SN>): FeVarbsInner<SN> {
  const { varbNames } = sectionMetas.section(sectionName);
  return varbNames.reduce((varbs, varbName) => {
    (varbs as FeVarbsInner<SectionName<"hasVarb">>)[varbName] = FeVarb.init({
      sectionName,
      feId,
      varbName,
      dbVarb: dbVarbs[varbName],
    });
    return varbs;
  }, {} as FeVarbsInner<SN>);
}
