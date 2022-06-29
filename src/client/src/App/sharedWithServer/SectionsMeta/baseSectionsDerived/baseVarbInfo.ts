import { z } from "zod";
import { zNanoId, zString } from "../../utils/zod";
import { SimpleSectionName } from "../baseSections";
import { BaseIdType, NanoIdInfo } from "../baseSectionsUtils/baseIdInfo";
import { RelativeIds, RelIdInfo } from "../baseSectionsUtils/relativeIdInfo";
import { DbMixedInfo, FeMixedInfo } from "./baseSectionInfo";
import { BaseName } from "./baseSectionTypes";

interface RandomStringIdNameInfo<
  SN extends SimpleSectionName | "no parent" = SimpleSectionName
> extends NanoIdInfo {
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
  S extends BaseName<"uniqueDbId"> = BaseName<"uniqueDbId">
> = DbMixedInfo<S>;

export type SpecificSectionInfo<
  S extends SimpleSectionName = SimpleSectionName
> =
  | FeMixedInfo<S>
  | DbUserDefInfo<Extract<S, BaseName<"uniqueDbId">>>
  | RelInfoStatic<Extract<S, BaseName<"alwaysOne">>>;

export type SpecificSectionsInfo<
  S extends SimpleSectionName = SimpleSectionName
> = SpecificSectionInfo<S> | DbMixedInfo<S> | RelInfoAll<S>;

export type MultiFindByFocalInfo<
  S extends SimpleSectionName = SimpleSectionName
> = RandomStringIdNameInfo<S> | RelFindByFocalInfo<S>;

// varbInfo
export type VarbParam = { varbName: string };

export type SpecificVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">
> = SpecificSectionInfo<S> & { varbName: string };

export interface FeVarbInfo<SN extends BaseName = BaseName<"hasVarb">>
  extends FeMixedInfo<SN>,
    VarbParam {}
export interface DbVarbInfo<S extends BaseName<"hasVarb"> = BaseName<"hasVarb">>
  extends DbMixedInfo<S>,
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

export type VarbNames<SN extends SimpleSectionName = SimpleSectionName> = {
  varbName: string;
  sectionName: SN;
};

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
  idType: z.literal("dbId" as BaseIdType),
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
