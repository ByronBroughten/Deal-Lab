import { Merge } from "../../utils/Obj/merge";
import { StrictOmit } from "../../utils/types";
import { SectionName } from "../SectionName";
import { relVarb } from "./rel/relVarb";
import { RelVarb } from "./rel/relVarbTypes";
import { GeneralRelVarbs, RelVarbs } from "./relVarbs";

type UnUniformRelVarbs<SN extends SectionName> = StrictOmit<
  RelVarbs<SN>,
  "_typeUniformity"
>;

export function relSection<
  SN extends SectionName,
  DN extends string,
  RVS extends UnUniformRelVarbs<SN>
>(displayName: DN, relVarbs: RVS): RelSection<SN, DN, RVS> {
  return {
    displayName,
    relVarbs: { ...relVarbs, _typeUniformity: relVarb("string") },
  } as any;
}

export type RelSection<
  SN extends SectionName,
  DN extends string = string,
  RVS extends UnUniformRelVarbs<SN> = UnUniformRelVarbs<SN>
> = {
  displayName: DN;
  relVarbs: RVS & { _typeUniformity: RelVarb<"string"> };
};

export type RelPropName = keyof GeneralRelSection;
export type GeneralRelSection = {
  displayName: string;
  relVarbs: GeneralRelVarbs;
};

export type GenericRelSection<SN extends SectionName> = Merge<
  GeneralRelSection,
  {
    relVarbs: RelVarbs<SN>;
  }
>;
