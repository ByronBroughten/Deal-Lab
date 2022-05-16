import { StateValue } from "../SectionsState/FeSection/FeVarb/feValue";
import { BaseName } from "./baseSectionTypes";
import {
  DbNameInfo,
  FeNameInfo,
  FeVarbInfo,
  MultiFindByFocalInfo,
  MultiSectionInfo,
  MultiVarbInfo,
  SpecificSectionInfo,
} from "./relSections/rel/relVarbInfoTypes";
import {
  ChildName,
  DescendantName,
  SelfOrDescendantName,
} from "./relSectionTypes/ChildTypes";
import { ParentName } from "./relSectionTypes/ParentTypes";
import { FeSectionNameType, SectionName, sectionNameS } from "./SectionName";

export interface FeInfoByType<T extends FeSectionNameType = "all"> {
  sectionName: SectionName<T>;
  feId: string;
}
export interface FeSectionInfo<SN extends SectionName = SectionName> {
  sectionName: SN;
  feId: string;
}
export interface FeChildInfo<SN extends SectionName = SectionName<"hasChild">> {
  sectionName: ChildName<SN>;
  feId: string;
}
export interface FeDescendantInfo<
  SN extends SectionName = SectionName<"hasChild">
> {
  sectionName: DescendantName<SN>;
  feId: string;
}
export interface FeSelfOrDescendantInfo<SN extends SectionName> {
  sectionName: SelfOrDescendantName<SN>;
  feId: string;
}
export interface FeParentInfo<SN extends SectionName> {
  sectionName: ParentName<SN>;
  feId: string;
}

export interface VarbInfo<T extends FeSectionNameType = "hasVarb">
  extends FeInfoByType<T> {
  varbName: string;
}

export interface VarbValueInfo<SN extends SectionName = SectionName<"hasVarb">>
  extends VarbInfo<SN> {
  value: StateValue;
}

export type FeInfo<T extends FeSectionNameType = "all"> = FeNameInfo<
  SectionName<T>
>;
export type DbInfo<T extends FeSectionNameType = "all"> = DbNameInfo<
  SectionName<T>
>;

const noParentWarning = "no parent";

export const noParentFeInfo = {
  sectionName: noParentWarning,
  id: noParentWarning,
  idType: "feId",
} as const;

export const noParentInfoNext = {
  sectionName: noParentWarning,
  feId: noParentWarning,
} as const;

export type NoParentFeInfo = typeof noParentFeInfo;

type MakeVarbInfo<I extends MultiSectionInfo> = MultiVarbInfo<
  Exclude<I["sectionName"], "main">
> & { idType: I["idType"]; id: I["id"] };

export const InfoS = {
  is: {
    singleMulti(info: MultiSectionInfo): info is MultiFindByFocalInfo {
      const { id, idType } = info;
      return (
        ["feId", "dbId"].includes(idType as any) ||
        ["parent", "local"].includes(id)
      );
    },
    specific(info: MultiSectionInfo): info is SpecificSectionInfo {
      const { id, idType } = info;
      return ["feId"].includes(idType as any) || id === "static";
    },
    db<T extends FeSectionNameType = "all">(
      value: any,
      type?: T
    ): value is DbInfo<T> {
      return (
        value.idType === "dbId" &&
        typeof value.id === "string" &&
        sectionNameS.is(value.sectionName, type)
      );
    },
    fe<T extends FeSectionNameType = "all">(
      value: any,
      type?: T
    ): value is FeInfo<T> {
      return (
        value.idType === "feId" &&
        typeof value.id === "string" &&
        sectionNameS.is(value.sectionName, type)
      );
    },
    feVarb(value: any): value is FeVarbInfo {
      return typeof value.varbName === "string" && this.fe(value, "hasVarb");
    },
    feName<S extends SectionName>(
      feInfo: FeNameInfo,
      sectionName: S
    ): feInfo is FeNameInfo<S> {
      return feInfo.sectionName === sectionName;
    },
  },
  fe<S extends SectionName>(sectionName: S, id: string): FeNameInfo<S> {
    return { sectionName, id, idType: "feId" };
  },
  db<S extends SectionName>(sectionName: S, dbId: string): DbNameInfo<S> {
    return {
      sectionName,
      id: dbId,
      idType: "dbId",
    };
  },
  multiVarb<I extends MultiSectionInfo>(
    varbName: string,
    info: I
  ): MakeVarbInfo<I> {
    const { sectionName } = info;
    if (sectionName === "main")
      throw new Error("varbInfo must be for sections that contain varbs");
    else return { ...info, sectionName, varbName } as MakeVarbInfo<I>;
  },
  feVarb<I extends FeInfo>(
    varbName: string,
    feInfo: I
  ): FeVarbInfo<Extract<I["sectionName"], BaseName<"hasVarb">>> {
    if (sectionNameS.is(feInfo.sectionName, "hasVarb"))
      return { ...feInfo, varbName } as any as FeVarbInfo<
        Extract<I["sectionName"], BaseName<"hasVarb">>
      >;
    else throw new Error("section must contain at least one varb");
  },
  feVarbMaker(feInfo: FeNameInfo): (varbName: string) => FeVarbInfo {
    const { sectionName } = feInfo;
    if (sectionNameS.is(sectionName, "hasVarb"))
      return (varbName) => ({ ...feInfo, sectionName, varbName });
    else throw new Error("section must contain at least one varb");
  },
};
