import { pick } from "lodash";
import { Obj } from "../../utils/Obj";
import { sectionMetas } from "../SectionMetas";
import {
  ChildIdArrs,
  OneChildIdArrs,
} from "../SectionMetas/relNameArrs/ChildTypes";
import { Id } from "../SectionMetas/relSections/baseSections/id";
import { SectionName } from "../SectionMetas/SectionName";
import { DbVarbs } from "../SectionPack/RawSection";
import StateSection, {
  NextStateSectionCore,
  NextStateSectionInitProps,
} from "../StateSection";
import { StateVarbs } from "./methods/varbs";
import StateVarb from "./StateVarb";

export function initStateSection<SN extends SectionName>(
  props: NextStateSectionInitProps<SN>
) {
  const core = initCore(props);
  return new StateSection(core);
}

function initCore<SN extends SectionName>({
  sectionName,
  feId = Id.make(),
  childFeIds = {},
  dbVarbs = {},
  ...rest
}: NextStateSectionInitProps<SN>): NextStateSectionCore<SN> {
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
