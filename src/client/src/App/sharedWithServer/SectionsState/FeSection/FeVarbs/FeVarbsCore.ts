import { pick } from "lodash";
import { DbVarbs } from "../../../Analyzer/SectionPackRaw/RawSection";
import { sectionMetas } from "../../../SectionMetas";
import { FeInfoByType } from "../../../SectionsMeta/Info";
import { SectionName } from "../../../SectionsMeta/SectionName";
import FeVarb from "../FeVarb";

export interface FeVarbsCore<SN extends SectionName> extends FeInfoByType<SN> {
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
  extends FeInfoByType<SN> {
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
