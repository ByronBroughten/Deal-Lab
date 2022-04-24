import { pick } from "lodash";
import { DbVarbs } from "../../../Analyzer/SectionPackRaw/RawSection";
import { sectionMetas } from "../../../SectionMetas";
import { Id } from "../../../SectionMetas/baseSections/id";
import {
  ChildIdArrs,
  OneChildIdArrs,
} from "../../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../../SectionMetas/SectionName";
import { Obj } from "../../../utils/Obj";
import FeSection, { FeSectionCore, SectionInitProps } from "../../FeSection";
import StateVarb from "../FeVarb";
import { StateVarbs } from "./varbs";

export function initStateSectionNext<SN extends SectionName>(
  props: SectionInitProps<SN>
) {
  const core = initCore(props);
  return new FeSection(core);
}

function initCore<SN extends SectionName>({
  sectionName,
  feId = Id.make(),
  childFeIds = {},
  dbVarbs = {},
  ...rest
}: SectionInitProps<SN>): FeSectionCore<SN> {
  return {
    sectionName,
    feId,
    dbId: Id.make(),
    childFeIds: initChildFeIds(sectionName, childFeIds),
    varbs: nextInitVarbs(sectionName, feId, dbVarbs),
    ...rest,
  };
}

function initChildFeIds<SN extends SectionName>(
  sectionName: SN,
  proposed: Partial<ChildIdArrs<SN>> = {}
): OneChildIdArrs<SN, "fe"> {
  const sectionMeta = sectionMetas.section(sectionName, "fe");
  return {
    ...sectionMeta.emptyChildIds(),
    ...pick(proposed, [
      sectionMeta.get("childNames") as any as keyof ChildIdArrs<SN>,
    ]),
  };
}

function nextInitVarbs(
  sectionName: SectionName,
  feId: string,
  dbVarbs: Partial<DbVarbs> = {}
): StateVarbs {
  const varbMetas = sectionMetas.varbs(sectionName);
  return Obj.entries(varbMetas.core).reduce((varbs, [varbName, varbMeta]) => {
    varbs[varbName] = StateVarb.init({
      sectionName,
      varbName,
      feId,
      dbVarb: dbVarbs[varbName],
    });

    return varbs;
  }, {} as StateVarbs);
}
