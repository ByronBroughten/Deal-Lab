import { extend, omit } from "lodash";
import { ObjectKeys } from "../../../../utils/Obj";
import { BaseName, BaseSections } from "../baseSectionTypes";
import { relVarb } from "./relVarb";
import { PreVarbs, preVarbs } from "./relVarbs";
import { StateValue } from "../../../StateSection/StateVarb/stateValue";
import { baseSections } from "../baseSections";
import { DbEntry } from "../../../DbEntry";

export type RelSectionOptions = {
  childSectionNames: readonly BaseName[];
  initEntry?: DbEntry;
  initBunch?: { [key: string]: StateValue }[];
  parent?: BaseName;
  rowSourceName?: BaseName;
  indexStoreName?: BaseName<"dbStore">;
  defaultStoreName?: BaseName<"dbStore">;
};
interface DefaultOptions extends Pick<RelSectionOptions, "childSectionNames"> {
  readonly childSectionNames: [];
}
type GetDefaultOptions<O extends Options> = Omit<DefaultOptions, keyof O>;

const defaultOptions: DefaultOptions = {
  childSectionNames: [],
};
type Options = Partial<RelSectionOptions>;
export type RelSection<
  S extends BaseName,
  D extends string,
  PVS extends PreVarbs<S>,
  O extends Options = {}
> = Record<
  S,
  {
    displayName: D;
    preVarbs: PVS;
  } & GetDefaultOptions<O> &
    O &
    BaseSections[S]
>;

export const relSection = {
  base<
    S extends BaseName,
    D extends string,
    PVS extends PreVarbs<S>,
    O extends Options = {}
  >(
    sectionName: S,
    displayName: D,
    preVarbs: PVS,
    options?: O
  ): RelSection<S, D, PVS, O> {
    return {
      // to get this working without any, I'd have to add a typeguard.
      [sectionName]: extend(
        {
          displayName,
          preVarbs,
          ...omit(defaultOptions, ObjectKeys(options ?? {})),
          // this omit shouldn't be necessary but makes type checking work.
          ...options,
        },
        baseSections[sectionName]
      ),
    } as any as RelSection<S, D, PVS, O>;
  },
  singleTimeList<
    S extends BaseName<"singleTimeList">,
    D extends string,
    O extends Options = {}
  >(sectionName: S, displayName: D, options?: O) {
    return this.base(
      sectionName,
      displayName,
      preVarbs.singleTimeList(sectionName),
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
      sectionName,
      displayName,
      preVarbs.ongoingList(sectionName),
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
      sectionName,
      displayName,
      { title: relVarb.string() } as PreVarbs<S>,
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
      sectionName,
      displayName,
      {
        searchFilter: relVarb.string(),
        rowIds: relVarb.type("stringArray"),
      } as PreVarbs<S>,
      {
        rowSourceName,
        parent: "main",
        childSectionNames: ["column"] as const,
      }
    );
  },
};
