import { pick } from "lodash";
import Analyzer from "../../../Analyzer";
import { sectionMetas } from "../../../SectionMetas";
import { FeInfo, Inf } from "../../../SectionMetas/Info";
import {
  ChildIdArrs,
  OneChildIdArrs,
} from "../../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../../SectionMetas/SectionName";
import Section, { FeSectionCore } from "../../FeSection";
import { InitStateSectionProps } from "../../FeSectionOld";
import StateVarb from "../FeVarb";
import { StateVarbs, VarbValues } from "./varbs";

export function initStateSection<S extends SectionName>({
  feId,
  sectionName,
  parentInfo,
  options: { dbId = Analyzer.makeId(), values } = {},
}: InitStateSectionProps<S>): Section<S> {
  const stateSectionCore: FeSectionCore<S> = {
    feId,
    dbId,
    sectionName,
    parentInfo,
    childFeIds: initChildFeIds(sectionName),
    varbs: initVarbs(Inf.fe(sectionName, feId), values),
  };
  return new Section(stateSectionCore);
}

export function initVarbs(feInfo: FeInfo, values: VarbValues = {}): StateVarbs {
  const nextVarbs: StateVarbs = {};
  const { sectionName, id } = feInfo;
  const varbMetas = sectionMetas.varbs(sectionName);
  for (const [varbName, varbMeta] of Object.entries(varbMetas.getCore())) {
    const proposedValue = values[varbName];
    const isValidProposal =
      varbName in values && varbMeta.isVarbValueType(proposedValue);
    const value = isValidProposal ? proposedValue : varbMeta.initValue;
    nextVarbs[varbName] = StateVarb.init({
      varbName,
      sectionName,
      feId: id,
      dbVarb: (varbMeta.value.stateToRaw as (v: any) => any)(value),
    });
  }
  return nextVarbs;
}

function initChildFeIds<SN extends SectionName>(
  sectionName: SN,
  proposed: Partial<ChildIdArrs<SN, "fe">> = {}
): OneChildIdArrs<SN, "fe"> {
  const sectionMeta = sectionMetas.section(sectionName, "fe");
  return {
    ...sectionMeta.emptyChildIds(),
    ...pick(proposed, [
      sectionMeta.get("childNames") as any as keyof ChildIdArrs<SN, "fe">,
    ]),
  };
}