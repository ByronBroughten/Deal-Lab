import { z } from "zod";
import { zNanoId, zString } from "../../../utils/zod";
import { ContextName, SimpleSectionName } from "../../baseSections";
import {
  DbIdInfo,
  FeIdInfo,
  RandomStringIdInfo,
  RelativeIds,
  RelIdInfo,
} from "../../baseSections/id";
import { BaseName } from "../../baseSectionTypes";

export interface FeNameInfo<
  SN extends SimpleSectionName | "no parent" = SimpleSectionName
> extends FeIdInfo {
  sectionName: SN;
}
export interface DbNameInfo<
  SN extends SimpleSectionName | "no parent" = SimpleSectionName
> extends DbIdInfo {
  sectionName: SN;
}

interface RandomStringIdNameInfo<
  SN extends SimpleSectionName | "no parent" = SimpleSectionName
> extends RandomStringIdInfo {
  sectionName: SN;
}

export interface RelSectionInfo<
  // the sectionName in "parent" rel info should not matter or not be there.
  SN extends SimpleSectionName = SimpleSectionName
> extends RelIdInfo {
  sectionName: SN;
}

export type MultiSectionInfo<SN extends SimpleSectionName = SimpleSectionName> =
  RandomStringIdNameInfo<SN> | RelSectionInfo<SN>;

export type DbUserDefInfo<
  S extends BaseName<"uniqueDbId"> | BaseName<"rowIndex"> =
    | BaseName<"uniqueDbId">
    | BaseName<"rowIndex">
> = DbNameInfo<S>;

export type SpecificSectionInfo<
  S extends SimpleSectionName = SimpleSectionName
> =
  | FeNameInfo<S>
  | DbUserDefInfo<Extract<S, BaseName<"uniqueDbId"> | BaseName<"rowIndex">>>
  | RelInfoStatic<Extract<S, BaseName<"alwaysOne">>>;

export type SpecificSectionsInfo<
  S extends SimpleSectionName = SimpleSectionName
> = SpecificSectionInfo<S> | DbNameInfo<S> | RelInfoAll<S>;

export type MultiFindByFocalInfo<
  S extends SimpleSectionName = SimpleSectionName
> = RandomStringIdNameInfo<S> | RelFindByFocalInfo<S>;

// varbInfo
export type VarbParam = { varbName: string };

export type SpecificVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">
> = SpecificSectionInfo<S> & { varbName: string };

export interface FeVarbInfo<SN extends BaseName = BaseName<"hasVarb">>
  extends FeNameInfo<SN>,
    VarbParam {}
export interface DbVarbInfo<S extends BaseName<"hasVarb"> = BaseName<"hasVarb">>
  extends DbNameInfo<S>,
    VarbParam {}
export interface RelVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">
> extends RelSectionInfo<S>,
    VarbParam {}

export type DbUserDefVarbInfo<
  S extends BaseName<"uniqueDbId"> = BaseName<"uniqueDbId">
> = DbUserDefInfo<S> & VarbParam;

export type MultiVarbInfo<S extends BaseName<"hasVarb"> = BaseName<"hasVarb">> =
  MultiSectionInfo<S> & VarbParam;
export type MultiFindByFocalVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">
> = MultiFindByFocalInfo<S> & VarbParam;

type VarbNameObj = {
  [SC in ContextName]: {
    [SN in SimpleSectionName]: {
      varbName: string;
      sectionName: SN;
      sectionContext: SC;
    };
  };
};
export type NextVarbNames = VarbNameObj[ContextName][SimpleSectionName];
export type SimpleVarbNames<SN extends SimpleSectionName = SimpleSectionName> =
  {
    varbName: string;
    sectionName: SN;
  };

export interface VarbNames<
  SN extends SimpleSectionName<SC>,
  SC extends ContextName = "fe"
> {
  varbName: string;
  sectionName: SN;
  sectionContext: SC;
}

// relative infos
export interface LocalRelVarbInfo extends RelVarbInfo {
  id: "local";
}

export interface RelInfoStatic<
  S extends BaseName<"alwaysOne"> = BaseName<"alwaysOne">
> extends RelSectionInfo<S> {
  id: "static";
}

export interface RelInfoAll<S extends BaseName> extends RelSectionInfo<S> {
  id: "all";
}

export interface RelVarbInfoStatic<
  S extends BaseName<"alwaysOneHasVarb"> = BaseName<"alwaysOneHasVarb">
> extends RelInfoStatic<S>,
    VarbParam {}

interface RelFindByFocalInfo<S extends SimpleSectionName = SimpleSectionName>
  extends RelSectionInfo<S> {
  id: RelativeIds["focal"];
}

export interface RelFindByFocalVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">
> extends RelFindByFocalInfo<S>,
    VarbParam {}

export interface OutRelVarbInfo extends RelVarbInfo {
  id: RelativeIds["outVarb"];
}
export interface InRelVarbInfo extends RelVarbInfo {
  id: RelativeIds["inVarb"];
}
export interface SingleInRelVarbInfo extends InRelVarbInfo {
  id: RelativeIds["singleInVarb"];
}

const zSectionNameProp = z.object({ sectionName: zString });
const zDbSectionInfo = zSectionNameProp.extend({
  id: zNanoId,
  idType: z.literal("dbId" as DbIdInfo["idType"]),
});
const zImmutableRelSectionInfo = zSectionNameProp.extend({
  id: z.literal("static" as RelativeIds["static"]),
  idType: z.literal("relative"),
});
export const zImmutableRelVarbInfo = zImmutableRelSectionInfo.extend({
  varbName: zString,
});
export const zDbVarbInfo = zDbSectionInfo.extend({
  sectionName: zString,
  varbName: zString,
});
