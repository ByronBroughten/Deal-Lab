import {
  DbMixedInfo,
  FeMixedInfo,
} from "./baseSectionsDerived/baseSectionInfo";
import {
  DbUserDefInfo,
  DbUserDefVarbInfo,
  FeVarbInfo,
  MultiFindByFocalInfo,
  MultiSectionInfo,
  MultiVarbInfo,
  RelInfoStatic,
  RelVarbInfoStatic,
  SpecificSectionInfo,
} from "./baseSectionsDerived/baseVarbInfo";
import { InEntityVarbInfo } from "./baseSectionsUtils/baseValues/entities";
import { StateValue } from "./baseSectionsUtils/baseValues/StateValueTypes";
import { Id } from "./baseSectionsUtils/id";
import {
  DescendantType,
  SelfOrDescendantType,
} from "./childSectionsDerived/ChildTypes";
import { ParentName, ParentNameSafe } from "./childSectionsDerived/ParentTypes";
import { SectionName, sectionNameS, SectionNameType } from "./SectionName";

export interface FeInfoByType<T extends SectionNameType = "all"> {
  sectionName: SectionName<T>;
  feId: string;
}
export type DbInfoByType<ST extends SectionNameType = "all"> = {
  sectionName: SectionName<ST>;
  dbId: string;
};

export interface FeSectionInfo<SN extends SectionName = SectionName> {
  sectionName: SN;
  feId: string;
}
export interface SectionArrInfo<SN extends SectionName> {
  sectionName: SN;
  feIds: string;
}

export interface FeDescendantInfo<
  SN extends SectionName = SectionName<"hasChild">
> {
  sectionName: DescendantType<SN>;
  feId: string;
}
export interface FeSelfOrDescendantInfo<SN extends SectionName> {
  sectionName: SelfOrDescendantType<SN>;
  feId: string;
}
export interface FeParentInfo<SN extends SectionName> {
  sectionName: ParentName<SN>;
  feId: string;
}
export interface FeParentInfoSafe<SN extends SectionName> {
  sectionName: ParentNameSafe<SN>;
  feId: string;
}

export interface VarbInfo<SN extends SectionName = SectionName<"hasVarb">>
  extends FeSectionInfo<SN> {
  varbName: string;
}

export interface VarbValueInfo<SN extends SectionName = SectionName<"hasVarb">>
  extends VarbInfo<SN> {
  value: StateValue;
}

export type VarbStringInfo = {
  sectionName: string;
  varbName: string;
  id: string;
  idType: string;
};

export type DbInfo<T extends SectionNameType = "all"> = DbMixedInfo<
  SectionName<T>
>;

export const noParentWarning = "no parent";

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
  isFeVarbInfo(value: any): value is VarbInfo {
    return (
      Id.is(value.feId) &&
      sectionNameS.is(value.sectionName) &&
      typeof value.varbName === "string"
    );
  },
  is: {
    inEntityVarb(value: any): value is InEntityVarbInfo {
      return this.dbUserDefVarb(value) || this.relStaticVarb(value);
    },
    dbUserDef(value: any): value is DbUserDefInfo {
      return sectionNameS.is(value.sectionName, "uniqueDbId") && this.db(value);
    },
    dbUserDefVarb(value: any): value is DbUserDefVarbInfo {
      return typeof value.varbName === "string" && this.dbUserDef(value);
    },
    relStatic(value: any): value is RelInfoStatic {
      return (
        sectionNameS.is(value.sectionName) &&
        value.idType === "relative" &&
        value.id === "static"
      );
    },
    relStaticVarb(value: any): value is RelVarbInfoStatic {
      return typeof value.varbName === "string" && this.relStatic(value);
    },
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
    db<T extends SectionNameType = "all">(
      value: any,
      type?: T
    ): value is DbInfo<T> {
      return (
        value.idType === "dbId" &&
        typeof value.id === "string" &&
        sectionNameS.is(value.sectionName, type)
      );
    },
    fe<T extends SectionNameType = "all">(
      value: any,
      type?: T
    ): value is FeMixedInfo<SectionName<T>> {
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
      feInfo: FeMixedInfo,
      sectionName: S
    ): feInfo is FeMixedInfo<S> {
      return feInfo.sectionName === sectionName;
    },
  },
  fe<S extends SectionName>(sectionName: S, id: string): FeMixedInfo<S> {
    return { sectionName, id, idType: "feId" };
  },
  feToMixed<SN extends SectionName>({
    sectionName,
    feId,
  }: FeSectionInfo<SN>): FeMixedInfo<SN> {
    return {
      sectionName,
      id: feId,
      idType: "feId",
    };
  },
  feToMixedVarb<SN extends SectionName>({
    varbName,
    ...rest
  }: VarbInfo<SN>): FeVarbInfo<SN> {
    return {
      varbName,
      ...this.feToMixed(rest),
    };
  },
  db<S extends SectionName>(sectionName: S, dbId: string): DbMixedInfo<S> {
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
  feVarbMaker(feInfo: FeMixedInfo): (varbName: string) => FeVarbInfo {
    const { sectionName } = feInfo;
    if (sectionNameS.is(sectionName, "hasVarb"))
      return (varbName) => ({ ...feInfo, sectionName, varbName });
    else throw new Error("section must contain at least one varb");
  },
};
