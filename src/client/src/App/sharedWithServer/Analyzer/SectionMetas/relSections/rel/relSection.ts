import { extend, omit } from "lodash";
import { ObjectKeys } from "../../../../utils/Obj";
import { BaseName } from "../baseSectionTypes";
import { relVarb } from "./relVarb";
import { RelVarbs, relVarbs } from "./relVarbs";
import { StateValue } from "../../../StateSection/StateVarb/stateValue";
import {
  BaseSections,
  baseSections,
  ExtractSectionContext,
  SectionContext,
  extractSectionContext,
  SectionContextOrBoth,
  SimpleSectionName,
} from "../baseSections";
import { DbEntry } from "../../../DbEntry";

export type GeneralRelSection = {
  childSectionNames: readonly BaseName[];
  initEntry?: DbEntry;
  initBunch?: { [key: string]: StateValue }[];
  parent?: BaseName;
  rowSourceName?: BaseName;
  indexStoreName?: BaseName<"dbStore", "db">;
  defaultStoreName?: BaseName<"dbStore", "db">;
};

export type RelSectionOptions = GeneralRelSection;
interface DefaultOptions extends Pick<RelSectionOptions, "childSectionNames"> {
  readonly childSectionNames: [];
}
type GetDefaultOptions<O extends Options> = Omit<DefaultOptions, keyof O>;

const defaultOptions: DefaultOptions = {
  childSectionNames: [],
};
type Options = Partial<RelSectionOptions>;
//

export type RelSection<
  SC extends SectionContext,
  SN extends SimpleSectionName<SC>,
  D extends string,
  PVS extends RelVarbs<SC, SN>,
  O extends Options = {}
> = Record<
  SN,
  {
    displayName: D;
    relVarbs: PVS;
  } & GetDefaultOptions<O> &
    O &
    BaseSections[SC][SN]
>;

export const relSection = {
  base<
    SCB extends SectionContextOrBoth,
    SN extends SimpleSectionName<ExtractSectionContext<SCB>>,
    D extends string,
    PVS extends RelVarbs<ExtractSectionContext<SCB>, SN>,
    O extends Options = {}
  >(
    sectionContextOrBoth: SCB,
    sectionName: SN,
    displayName: D,
    relVarbs: PVS,
    options?: O
  ): RelSection<ExtractSectionContext<SCB>, SN, D, PVS, O> {
    const sectionContext = extractSectionContext(sectionContextOrBoth);
    return {
      // to get this working without any, I'd have to add a typeguard.
      [sectionName]: extend(
        {
          displayName,
          relVarbs,
          ...omit(defaultOptions, ObjectKeys(options ?? {})),
          // this omit shouldn't be necessary but makes type checking work.
          ...options,
        },
        baseSections[sectionContext][sectionName]
      ),
    } as any as RelSection<ExtractSectionContext<SCB>, SN, D, PVS, O>;
  },
  singleTimeList<
    S extends BaseName<"singleTimeList">,
    D extends string,
    O extends Options = {}
  >(sectionName: S, displayName: D, options?: O) {
    return this.base(
      "fe" as SectionContext,
      sectionName,
      displayName,
      relVarbs.singleTimeList(sectionName),
      {
        ...options,
        childSectionNames: ["singleTimeItem"] as const,
        indexStoreName: "userSingleList",
      } as const
    );
  },
  ongoingList<
    S extends BaseName<"ongoingList">,
    D extends string,
    O extends Options = {}
  >(sectionName: S, displayName: D, options?: O) {
    return this.base(
      "fe" as SectionContext,
      sectionName,
      displayName,
      relVarbs.ongoingList(sectionName),
      extend(options, {
        childSectionNames: ["ongoingItem"] as const,
        indexStoreName: "userOngoingList",
      } as const)
    );
  },
  rowIndex<S extends BaseName<"rowIndex">, D extends string>(
    sectionName: S,
    displayName: D
  ) {
    return this.base(
      "fe",
      sectionName,
      displayName,
      {
        title: relVarb.string(),
        compareToggle: relVarb.type("boolean"),
      } as RelVarbs<"fe", S>,
      {
        childSectionNames: ["cell"] as const,
      }
    );
  },
  managerTable<
    S extends BaseName<"table">,
    D extends string,
    R extends BaseName
  >(sectionName: S, displayName: D, rowSourceName: R) {
    return this.base(
      "fe" as SectionContext,
      sectionName,
      displayName,
      {
        searchFilter: relVarb.string(),
        rowIds: relVarb.type("stringArray"),
      } as RelVarbs<SectionContext, S>,
      {
        rowSourceName,
        parent: "main",
        childSectionNames: ["column"] as const,
      }
    );
  },
};
