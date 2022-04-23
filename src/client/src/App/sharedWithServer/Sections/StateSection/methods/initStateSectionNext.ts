import { pick } from "lodash";
import { Obj } from "../../../utils/Obj";
import { DbVarbs } from "../../DbEntry";
import { sectionMetas } from "../../SectionMetas";
import { Id } from "../../SectionMetas/baseSections/id";
import {
  ChildIdArrs,
  OneChildIdArrs,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import StateSection, {
  StateSectionCore,
  StateSectionInitProps,
} from "../../StateSection";
import StateVarb from "../StateVarb";
import { StateVarbs } from "./varbs";

export function initStateSectionNext<SN extends SectionName>(
  props: StateSectionInitProps<SN>
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
}: StateSectionInitProps<SN>): StateSectionCore<SN> {
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
