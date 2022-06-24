import { Obj } from "../../../utils/Obj";
import { Merge } from "../../../utils/Obj/merge";
import { SimpleSectionName } from "../../baseSections";
import { BaseName } from "../../baseSectionTypes";
import { SimpleDbStoreName } from "../../baseSectionTypes/dbStoreNames";
import { relVarb } from "./relVarb";
import { GeneralRelVarbs, RelVarbs, relVarbs } from "./relVarbs";

export type RelPropName = keyof GeneralRelSection;

export type GeneralRelSection = {
  relVarbs: GeneralRelVarbs;
  childNames: readonly SimpleSectionName[];

  displayName: string;
  tableIndexName: BaseName | null;

  tableStoreName: BaseName | null;

  fullIndexName: SimpleDbStoreName | null;
  rowIndexName: SimpleDbStoreName | null;
  arrStoreName: SimpleDbStoreName | null;
};
type FullOptions<SN extends SimpleSectionName> = Merge<
  GeneralRelSection,
  {
    relVarbs: RelVarbs<SN>;
    childNames: readonly SimpleSectionName[];
  }
>;

export type RelSectionOptions<SN extends SimpleSectionName> = Partial<
  FullOptions<SN>
>;

type RelSection<
  SN extends SimpleSectionName,
  D extends string,
  RVS extends RelVarbs<SN>,
  O extends RelSectionOptions<SN> = {}
> = Merge<DefaultRelSection<D, SN, RVS>, O>;

type DefaultRelSection<
  D extends string,
  SN extends SimpleSectionName,
  RVS extends RelVarbs<SN>
> = {
  sectionName: SN;
  displayName: D;
  relVarbs: RVS;
  childNames: readonly [];

  tableStoreName: null;
  tableIndexName: null;

  fullIndexName: null;
  rowIndexName: null;
  arrStoreName: null;
};

export type RelSectionProp<
  SN extends SimpleSectionName,
  D extends string,
  RVS extends RelVarbs<SN>,
  O extends RelSectionOptions<SN> = {}
> = Record<SN, RelSection<SN, D, RVS, O>>;

export const relSection = {
  default<
    D extends string,
    SN extends SimpleSectionName,
    RVS extends RelVarbs<SN>
  >(
    displayName: D,
    sectionName: SN,
    relVarbs: RVS
  ): DefaultRelSection<D, SN, RVS> {
    return {
      sectionName,
      displayName,
      relVarbs,
      childNames: [],
      fullIndexName: null,
      rowIndexName: null,
      arrStoreName: null,
      tableIndexName: null,

      tableStoreName: null,
    };
  },
  base<
    SN extends SimpleSectionName,
    D extends string,
    PVS extends RelVarbs<SN>,
    O extends RelSectionOptions<SN> = {}
  >(
    sectionName: SN,
    displayName: D,
    relVarbs: PVS,
    options?: O
  ): RelSectionProp<SN, D, PVS, O> {
    return {
      [sectionName]: Obj.merge(
        this.default(displayName, sectionName, relVarbs),
        options ?? ({} as O)
      ),
    } as RelSectionProp<SN, D, PVS, O>;
  },
  // pureNameSpace<
  //   SN extends BaseName,
  //   DN extends string,
  //   CNS extends BaseName[]
  // >(sectionName: SN, displayName: DN, childNames: CNS) {
  //   return this.base(
  //
  //     sectionName,
  //     displayName,
  //     { _typeUniformity: relVarb.string() },
  //     { childNames } as const
  //   )
  // },
  singleTimeList<
    SN extends BaseName<"singleTimeListType">,
    D extends string,
    O extends RelSectionOptions<SN> = {}
  >(sectionName: SN, displayName: D, options?: O) {
    return this.base(
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
    SN extends BaseName<"ongoingListType">,
    D extends string,
    O extends RelSectionOptions<SN> = {}
  >(sectionName: SN, displayName: D, options?: O) {
    return this.base(
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
    SN extends BaseName<"outputListType">,
    O extends RelSectionOptions<SN> = {}
  >(sectionName: SN, options?: O) {
    return relSection.base(
      sectionName,
      "Output List",
      { title: relVarb.string() } as RelVarbs<SN>,
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
      sectionName,
      displayName,
      {
        title: relVarb.string(),
        compareToggle: relVarb.type("boolean"),
      } as RelVarbs<S>,
      {
        childNames: ["cell"] as const,
      }
    );
  },
};
