import { Merge, Spread } from "../../../utils/Obj/merge";
import {
  StrictExclude,
  StrictPick,
  StrictPickPartial,
} from "../../../utils/types";
import { SimpleSectionName } from "../../baseSections";
import { BaseName } from "../../baseSectionTypes";
import { SimpleDbStoreName } from "../../baseSectionTypes/dbStoreNames";
import { GeneralRelChild } from "./relChild";
import { GeneralRelVarbs, RelVarbs } from "./relVarbs";

export type RelPropName = keyof GeneralRelSection;

export type GeneralRelSection = {
  displayName: string;
  relVarbs: GeneralRelVarbs;

  varbListItem: string | null;

  children: { [key: string]: GeneralRelChild };
  tableIndexName: BaseName | null;
  tableStoreName: BaseName | null;

  fullIndexName: SimpleDbStoreName | null;
  rowIndexName: SimpleDbStoreName | null;
  arrStoreName: SimpleDbStoreName | null;
};
export type GenericRelSection<SN extends SimpleSectionName> = Merge<
  GeneralRelSection,
  { relVarbs: RelVarbs<SN> }
>;

type OptionsKeys = StrictExclude<
  keyof GeneralRelSection,
  "displayName" | "relVarbs"
>;
export type RelSectionOptions<SN extends SimpleSectionName> = StrictPickPartial<
  GenericRelSection<SN>,
  OptionsKeys
>;
function makeDefault<O extends StrictPick<GeneralRelSection, OptionsKeys>>(
  options: O
): O {
  return options;
}

const defaultProps = makeDefault({
  children: {},
  varbListItem: null,
  fullIndexName: null,
  rowIndexName: null,
  arrStoreName: null,
  tableIndexName: null,
  tableStoreName: null,
});
type DefaultProps = typeof defaultProps;

export type RelSection<
  SN extends SimpleSectionName,
  DN extends string = string,
  RVS extends RelVarbs<SN> = RelVarbs<SN>,
  O extends RelSectionOptions<SN> = {}
> = Spread<
  [
    DefaultProps,
    O,
    {
      displayName: DN;
      relVarbs: RVS;
    }
  ]
>;

export function relSection<
  SN extends SimpleSectionName,
  DN extends string,
  RVS extends RelVarbs<SN>,
  O extends RelSectionOptions<SN> = {}
>(displayName: DN, relVarbs: RVS, options?: O): RelSection<SN, DN, RVS, O> {
  return {
    ...defaultProps,
    ...options,
    displayName,
    relVarbs,
  } as any;
}

function relSectionProp<
  SN extends SimpleSectionName,
  DN extends string,
  RVS extends RelVarbs<SN>,
  O extends RelSectionOptions<SN> = {}
>(
  sectionName: SN,
  displayName: DN,
  relVarbs: RVS,
  options?: O
): RelSectionProp<SN, DN, RVS, O> {
  return {
    [sectionName]: relSection(displayName, relVarbs, options),
  } as RelSectionProp<SN, DN, RVS, O>;
}

export type RelSectionProp<
  SN extends SimpleSectionName,
  DN extends string,
  RVS extends RelVarbs<SN>,
  O extends RelSectionOptions<SN> = {}
> = Record<SN, RelSection<SN, DN, RVS, O>>;

export const relSectionS = {
  base: relSectionProp,
};
