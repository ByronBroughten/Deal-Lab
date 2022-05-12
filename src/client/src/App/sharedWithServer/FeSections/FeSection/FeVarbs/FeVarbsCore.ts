import { pick } from "lodash";
import { DbVarbs } from "../../../Analyzer/SectionPackRaw/RawSection";
import { sectionMetas } from "../../../SectionMetas";
import { FeSectionInfo } from "../../../SectionMetas/Info";
import { SectionName } from "../../../SectionMetas/SectionName";
import FeVarb from "../FeVarb";

export interface FeVarbsCore<SN extends SectionName> extends FeSectionInfo<SN> {
  varbs: FeVarbsInner;
}

type FeVarbsInner = { [key: string]: FeVarb };

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
}: InitFeVarbsCoreProps<SN>): FeVarbsInner {
  const { varbNames } = sectionMetas.section(sectionName);
  return varbNames.reduce((varbs, varbName) => {
    varbs[varbName] = FeVarb.init({
      sectionName,
      feId,
      varbName,
      dbVarb: dbVarbs[varbName],
    });
    return varbs;
  }, {} as FeVarbsInner);
}
