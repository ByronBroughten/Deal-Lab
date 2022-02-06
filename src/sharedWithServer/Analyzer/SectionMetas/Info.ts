import {
  DbNameInfo,
  FeNameInfo,
  FeVarbInfo,
  MultiSectionInfo,
  MultiVarbInfo,
} from "./relSections/rel/relVarbInfoTypes";
import { FeSectionNameType, SectionNam, SectionName } from "./SectionName";

export type FeInfo<T extends FeSectionNameType = "all"> = FeNameInfo<
  SectionName<T>
>;
export type DbInfo<T extends FeSectionNameType = "all"> = DbNameInfo<
  SectionName<T>
>;

type MakeVarbInfo<I extends MultiSectionInfo> = MultiVarbInfo<
  Exclude<I["sectionName"], "main">,
  { idType: I["idType"]; id: I["id"] }
>;

export const Inf = {
  is: {
    db<T extends FeSectionNameType = "all">(
      value: any,
      type?: T
    ): value is DbInfo<T> {
      return (
        value.idType === "dbId" &&
        typeof value.id === "string" &&
        SectionNam.is(value.sectionName, type)
      );
    },
    fe<T extends FeSectionNameType = "all">(
      value: any,
      type?: T
    ): value is FeInfo<T> {
      return (
        value.idType === "feId" &&
        typeof value.id === "string" &&
        SectionNam.is(value.sectionName, type)
      );
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
  feVarb(varbName: string, feInfo: FeNameInfo): FeVarbInfo {
    const { sectionName } = feInfo;
    if (SectionNam.is(sectionName, "hasVarb"))
      return { ...feInfo, sectionName, varbName };
    else throw new Error("section must contain at least one varb");
  },
  feVarbMaker(feInfo: FeNameInfo): (varbName: string) => FeVarbInfo {
    const { sectionName } = feInfo;
    if (SectionNam.is(sectionName, "hasVarb"))
      return (varbName) => ({ ...feInfo, sectionName, varbName });
    else throw new Error("section must contain at least one varb");
  },
};
