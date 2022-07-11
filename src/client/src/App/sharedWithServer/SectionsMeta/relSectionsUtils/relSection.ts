import { Merge, Spread } from "../../utils/Obj/merge";
import {
  StrictExclude,
  StrictPick,
  StrictPickPartial,
} from "../../utils/types";
import { SimpleSectionName } from "../baseSections";
import { BaseName } from "../baseSectionsDerived/baseSectionTypes";
import { ChildName } from "../childSectionsDerived/ChildName";
import { ChildSectionNameName } from "../childSectionsDerived/ChildSectionName";
import { SimpleDbStoreName } from "../childSectionsDerived/dbStoreNames";
import { GeneralRelVarbs, RelVarbs } from "./relVarbs";

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

export type RelPropName = keyof GeneralRelSection;
export type GeneralRelSection = {
  displayName: string;
  relVarbs: GeneralRelVarbs;

  varbListItem: string | null;
  tableIndexName: BaseName | null;
  tableStoreName: BaseName | null;

  feTableIndexStoreName: ChildSectionNameName<"feStore", "table"> | null;
  feFullIndexStoreName: ChildName<"feStore"> | null;
  dbIndexStoreName: ChildName<"dbStore"> | null;
  dbArrStoreName: ChildName<"dbStore"> | null;

  fullIndexName: SimpleDbStoreName | null;
  rowIndexName: SimpleDbStoreName | null;
  arrStoreName: SimpleDbStoreName | null;
};

export type GenericRelSection<SN extends SimpleSectionName> = Merge<
  GeneralRelSection,
  {
    // feFullIndexStoreName: ChildSectionNameName<"feStore", SN> | null;
    relVarbs: RelVarbs<SN>;
    varbListItem: ChildName<SN> | null;
  }
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
  varbListItem: null,
  fullIndexName: null,
  rowIndexName: null,
  arrStoreName: null,
  tableIndexName: null,
  tableStoreName: null,

  feTableIndexStoreName: null,
  feFullIndexStoreName: null,
  dbIndexStoreName: null,
  dbArrStoreName: null,
});
type DefaultProps = typeof defaultProps;
