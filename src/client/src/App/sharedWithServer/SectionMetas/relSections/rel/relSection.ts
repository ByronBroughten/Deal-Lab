import { Obj } from "../../../utils/Obj";
import { Merge } from "../../../utils/Obj/merge";
import {
  AnySectionName,
  BaseSections,
  baseSections,
  ContextName,
  ExtractSectionContext,
  extractSectionContext,
  SectionContextOrBoth,
  SimpleSectionName,
} from "../../baseSections";
import { BaseName } from "../../baseSectionTypes";
import { relVarb } from "./relVarb";
import { GeneralRelVarbs, RelVarbs, relVarbs } from "./relVarbs";

export type GeneralRelSection = {
  relVarbs: GeneralRelVarbs;
  childNames: readonly AnySectionName[];

  displayName: string;
  rowSourceName: BaseName | null;
  tableSourceNameNext: BaseName | null;
  indexStoreName: BaseName<"dbStore", "db"> | null;
  indexStoreNameNext: BaseName<"dbStoreSection"> | null;

  fullIndexName: BaseName<"dbStoreNext"> | null;
  rowIndexName: BaseName<"dbStoreNext"> | null;
  arrStoreName: BaseName<"dbStoreNext"> | null;

  defaultStoreName: BaseName<"dbStore", "db"> | null;
};
type FullOptions<
  SC extends ContextName,
  SN extends SimpleSectionName<SC>
> = Merge<
  GeneralRelSection,
  {
    relVarbs: RelVarbs<SC, SN>;
    childNames: readonly SimpleSectionName<SC>[];
  }
>;

export type RelSectionOptions<
  SC extends ContextName,
  SN extends SimpleSectionName<SC>
> = Partial<FullOptions<SC, SN>>;

export type RelSection<
  SC extends ContextName,
  SN extends SimpleSectionName<SC>,
  D extends string,
  RVS extends RelVarbs<SC, SN>,
  O extends RelSectionOptions<SC, SN> = {}
> = Merge<DefaultRelSection<D, SC, SN, RVS>, O>;

type DefaultRelSection<
  D extends string,
  SC extends ContextName,
  SN extends SimpleSectionName<SC>,
  RVS extends RelVarbs<SC, SN>
> = {
  sectionContext: SC;
  sectionName: SN;
  displayName: D;
  relVarbs: RVS;
  childNames: [];
  rowSourceName: null;
  tableSourceNameNext: null;
  indexStoreName: null;
  indexStoreNameNext: null;
  defaultStoreName: null;

  fullIndexName: null;
  rowIndexName: null;
  arrStoreName: null;
};

export type RelSectionProp<
  SC extends ContextName,
  SN extends SimpleSectionName<SC>,
  D extends string,
  RVS extends RelVarbs<SC, SN>,
  O extends RelSectionOptions<SC, SN> = {}
> = Record<SN, RelSection<SC, SN, D, RVS, O>>;

export const relSection = {
  default<
    D extends string,
    SC extends ContextName,
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
      childNames: [],
      tableSourceNameNext: null,
      rowSourceName: null,
      indexStoreName: null,
      indexStoreNameNext: null,
      defaultStoreName: null,

      fullIndexName: null,
      rowIndexName: null,
      arrStoreName: null,
    };
  },
  base<
    SCB extends SectionContextOrBoth,
    SN extends SimpleSectionName<ExtractSectionContext<SCB>>,
    D extends string,
    PVS extends RelVarbs<ExtractSectionContext<SCB>, SN>,
    O extends RelSectionOptions<ExtractSectionContext<SCB>, SN> = {}
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
  // ok, it's going to have a kind of
  // arr store option

  singleTimeList<
    SN extends BaseName<"singleTimeList">,
    D extends string,
    O extends RelSectionOptions<ContextName, SN> = {}
  >(sectionName: SN, displayName: D, options?: O) {
    return this.base(
      "both",
      sectionName,
      displayName,
      relVarbs.singleTimeList(sectionName),
      {
        ...((options ?? {}) as O),
        childNames: ["singleTimeItem"] as const,
      }
    );
  },
  ongoingList<
    SN extends BaseName<"ongoingList">,
    D extends string,
    O extends RelSectionOptions<ContextName, SN> = {}
  >(sectionName: SN, displayName: D, options?: O) {
    return this.base(
      "both",
      sectionName,
      displayName,
      relVarbs.ongoingList(sectionName),
      {
        ...((options ?? {}) as O),
        childNames: ["ongoingItem"] as const,
      }
    );
  },
  outputList<
    SN extends BaseName<"outputList">,
    O extends RelSectionOptions<ContextName, SN> = {}
  >(sectionName: SN, options?: O) {
    return relSection.base(
      "both",
      sectionName,
      "Output List",
      { title: relVarb.string() } as RelVarbs<"fe", SN>,
      {
        childNames: ["output"] as const,
        ...((options ?? {}) as O),
      }
    );
  },
  rowIndex<S extends BaseName<"rowIndex"> | "tableRow", D extends string>(
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
        childNames: ["cell"] as const,
      }
    );
  },
  sectionTable<
    S extends BaseName<"table">,
    D extends string,
    R extends BaseName
  >(sectionName: S, displayName: D, rowSourceName: R) {
    return this.base(
      "fe" as ContextName,
      sectionName,
      displayName,
      {
        searchFilter: relVarb.string(),
        rowIds: relVarb.type("stringArray"),
      } as RelVarbs<ContextName, S>,
      {
        rowSourceName,
        parent: "main",
        childNames: ["column"] as const,
      }
    );
  },
  sectionTableNext<
    S extends BaseName<"tableNext">,
    D extends string,
    R extends BaseName
  >(sectionName: S, displayName: D, tableSourceNameNext: R) {
    return this.base(
      "fe" as ContextName,
      sectionName,
      displayName,
      { searchFilter: relVarb.string() } as RelVarbs<ContextName, S>,
      {
        tableSourceNameNext,
        parent: "main",
        arrStoreName: sectionName,
        childNames: ["column", "tableRow"] as const,
      }
    );
  },
};