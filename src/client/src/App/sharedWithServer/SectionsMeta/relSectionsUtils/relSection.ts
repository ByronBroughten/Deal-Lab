import { Merge, Spread } from "../../utils/Obj/merge";
import {
  StrictExclude,
  StrictOmit,
  StrictPick,
  StrictPickPartial,
} from "../../utils/types";
import { SimpleSectionName } from "../baseSections";
import { BaseName } from "../baseSectionsDerived/baseSectionTypes";
import { ChildName } from "../childSectionsDerived/ChildName";
import { ChildSectionNameName } from "../childSectionsDerived/ChildSectionName";
import { relVarb } from "./rel/relVarb";
import { RelVarb } from "./rel/relVarbTypes";
import { GeneralRelVarbs, RelVarbs } from "./relVarbs";

type UnUniformRelVarbs<SN extends SimpleSectionName> = StrictOmit<
  RelVarbs<SN>,
  "_typeUniformity"
>;

export function relSection<
  SN extends SimpleSectionName,
  DN extends string,
  RVS extends UnUniformRelVarbs<SN>,
  O extends RelSectionOptions<SN> = {}
>(displayName: DN, relVarbs: RVS, options?: O): RelSection<SN, DN, RVS, O> {
  return {
    ...defaultProps,
    ...options,
    displayName,
    relVarbs: { ...relVarbs, _typeUniformity: relVarb("string") },
  } as any;
}

export type RelSection<
  SN extends SimpleSectionName,
  DN extends string = string,
  RVS extends UnUniformRelVarbs<SN> = UnUniformRelVarbs<SN>,
  O extends RelSectionOptions<SN> = {}
> = Spread<
  [
    DefaultProps,
    O,
    {
      displayName: DN;
      relVarbs: RVS & { _typeUniformity: RelVarb<"string"> };
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

  compareTableName: ChildSectionNameName<"feUser", "compareTable"> | null;
  feDisplayIndexStoreName: ChildSectionNameName<
    "feUser",
    "displayNameList"
  > | null;
  feFullIndexStoreName: ChildName<"feUser"> | null;
  dbIndexStoreName: ChildName<"dbStore"> | null;
  dbArrStoreName: ChildName<"dbStore"> | null;
};

export type GenericRelSection<SN extends SimpleSectionName> = Merge<
  GeneralRelSection,
  {
    // feFullIndexStoreName: ChildSectionNameName<"feUser", SN> | null;
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
  tableIndexName: null,
  tableStoreName: null,

  compareTableName: null,
  feDisplayIndexStoreName: null,
  feFullIndexStoreName: null,
  dbIndexStoreName: null,
  dbArrStoreName: null,
});
type DefaultProps = typeof defaultProps;
