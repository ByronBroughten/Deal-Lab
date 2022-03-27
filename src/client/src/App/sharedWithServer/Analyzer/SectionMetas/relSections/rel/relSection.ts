import { extend } from "lodash";
import { BaseName } from "../baseSectionTypes";
import { relVarb } from "./relVarb";
import { GeneralRelVarbs, RelVarbs, relVarbs } from "./relVarbs";
import {
  BaseSections,
  baseSections,
  ExtractSectionContext,
  SectionContext,
  extractSectionContext,
  SectionContextOrBoth,
  SimpleSectionName,
  AnySectionName,
} from "../baseSections";
import { Merge } from "./../../../../utils/Obj/merge";
import { Obj } from "./../../../../utils/Obj";

export type GeneralRelSection = {
  relVarbs: GeneralRelVarbs;
  childSectionNames: readonly AnySectionName[];

  displayName: string;
  rowSourceName: BaseName<"rowIndex", "fe"> | null;
  indexStoreName: BaseName<"dbStore", "db"> | null;
  defaultStoreName: BaseName<"dbStore", "db"> | null;
};
type FullOptions<
  SC extends SectionContext,
  SN extends SimpleSectionName<SC>
> = Merge<
  GeneralRelSection,
  {
    relVarbs: RelVarbs<SC, SN>;
    childSectionNames: readonly SimpleSectionName<SC>[];
  }
>;

type Options<
  SC extends SectionContext,
  SN extends SimpleSectionName<SC>
> = Partial<FullOptions<SC, SN>>;

export type RelSection<
  SC extends SectionContext,
  SN extends SimpleSectionName<SC>,
  D extends string,
  RVS extends RelVarbs<SC, SN>,
  O extends Options<SC, SN> = {}
> = Merge<DefaultRelSection<D, SC, SN, RVS>, O>;

type DefaultRelSection<
  D extends string,
  SC extends SectionContext,
  SN extends SimpleSectionName<SC>,
  RVS extends RelVarbs<SC, SN>
> = {
  sectionContext: SC;
  sectionName: SN;
  displayName: D;
  relVarbs: RVS;
  childSectionNames: [];
  rowSourceName: null;
  indexStoreName: null;
  defaultStoreName: null;
};

export type RelSectionProp<
  SC extends SectionContext,
  SN extends SimpleSectionName<SC>,
  D extends string,
  RVS extends RelVarbs<SC, SN>,
  O extends Options<SC, SN> = {}
> = Record<SN, RelSection<SC, SN, D, RVS, O>>;

export const relSection = {
  default<
    D extends string,
    SC extends SectionContext,
    SN extends SimpleSectionName<SC>,
    RVS extends RelVarbs<SC, SN>
  >(
    displayName: D,
    sectionContext: SC,
    sectionName: SN,
    relVarbs: RVS
  ): DefaultRelSection<D, SC, SN, RVS> {
    return {
      sectionContext,
      sectionName,
      displayName,
      relVarbs,
      childSectionNames: [],
      rowSourceName: null,
      indexStoreName: null,
      defaultStoreName: null,
    };
  },
  base<
    SCB extends SectionContextOrBoth,
    SN extends SimpleSectionName<ExtractSectionContext<SCB>>,
    D extends string,
    PVS extends RelVarbs<ExtractSectionContext<SCB>, SN>,
    O extends Options<ExtractSectionContext<SCB>, SN> = {}
  >(
    sectionContextOrBoth: SCB,
    sectionName: SN,
    displayName: D,
    relVarbs: PVS,
    options?: O
  ): RelSectionProp<ExtractSectionContext<SCB>, SN, D, PVS, O> {
    const sectionContext = extractSectionContext(sectionContextOrBoth);
    const baseSection = baseSections[sectionContext][
      sectionName
    ] as BaseSections[ExtractSectionContext<SCB>][SN];
    return {
      [sectionName]: Obj.merge(
        this.default(displayName, sectionContext, sectionName, relVarbs),
        options ?? ({} as O)
      ),
    } as RelSectionProp<ExtractSectionContext<SCB>, SN, D, PVS, O>;
  },
  singleTimeList<
    SN extends BaseName<"singleTimeList">,
    D extends string,
    O extends Options<SectionContext, SN> = {}
  >(sectionName: SN, displayName: D, options?: O) {
    return this.base(
      "both",
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
    SN extends BaseName<"ongoingList">,
    D extends string,
    O extends Options<SectionContext, SN> = {}
  >(sectionName: SN, displayName: D, options?: O) {
    return this.base(
      "both",
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
    R extends BaseName<"rowIndex", "fe">
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
