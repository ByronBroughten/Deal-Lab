import { InfoS } from "../../../SectionsMeta/Info";
import { MultiVarbInfo } from "../../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../../SectionsMeta/SectionName";
import StateSection from "../../StateSection";
import StateVarb from "../StateVarb";
import { StateValue } from "../StateVarb/stateValue";

export type StateVarbs = { [varbName: string]: StateVarb };
export type VarbValues = { [varbName: string]: StateValue };
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
  if (!varb) throw varbNotFound(InfoS.feVarb(varbName, this.feInfo));
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
