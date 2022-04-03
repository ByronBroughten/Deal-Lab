import { sectionMetas } from "../../SectionMetas";
import { DbSectionInit } from "../../methods/internal/addSections";
import StateSection from "../../StateSection";
import StateVarb from "../StateVarb";
import { StateValue } from "../StateVarb/stateValue";
import { MultiVarbInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { FeInfo, Inf } from "../../SectionMetas/Info";
import { SectionName } from "../../SectionMetas/SectionName";
import { DbVarbs } from "../../SectionPack/RawSection";

export type StateVarbs = { [varbName: string]: StateVarb };
export type VarbValues = { [varbName: string]: StateValue };

export type VarbSeeds = {
  dbVarbs?: DbSectionInit["dbVarbs"];
  values?: VarbValues;
  varbs?: StateVarbs;
};

export function varbNotFound({
  varbName,
  sectionName,
  idType,
  id,
}: MultiVarbInfo) {
  return new Error(
    `There is no varb at ${sectionName}.${id}.${varbName} with idType ${idType}.`
  );
}

export function varb<S extends SectionName>(
  this: StateSection<S>,
  varbName: string
): StateVarb {
  const varb = this.core.varbs[varbName];
  if (!varb) throw varbNotFound(Inf.feVarb(varbName, this.feInfo));
  return varb;
}

export function replaceVarb<S extends SectionName>(
  this: StateSection<S>,
  nextVarb: StateVarb
): StateSection<S> {
  const { varbName } = nextVarb;
  return this.update({
    varbs: {
      ...this.core.varbs,
      [varbName]: nextVarb,
    },
  });
}

// export function nextInitVarbs(feInfo: FeInfo, dbvarbs: DbVarbs): StateVarbs {
//   const nextVarbs: StateVarbs = {};

// }

export function initVarbs(feInfo: FeInfo, values: VarbValues = {}): StateVarbs {
  const nextVarbs: StateVarbs = {};
  const { sectionName } = feInfo;
  const varbMetas = sectionMetas.varbMetas(sectionName);
  for (const [varbName, varbMeta] of Object.entries(varbMetas.getCore())) {
    const proposedValue = values[varbName];
    const isValidProposal =
      varbName in values && varbMeta.isVarbValueType(proposedValue);
    const value = isValidProposal ? proposedValue : varbMeta.initValue;
    nextVarbs[varbName] = StateVarb.init(Inf.feVarb(varbName, feInfo), {
      value,
    });
  }

  return nextVarbs;
}
