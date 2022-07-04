import { z } from "zod";
import { Obj } from "../../utils/Obj";
import { zNanoId, zString } from "../../utils/zod";
import { baseSections, SimpleSectionName } from "../baseSections";
import { NanoIdInfo, NanoIdType } from "../baseSectionsUtils/baseIdInfo";
import { RelativeIds, RelIdInfo } from "../baseSectionsUtils/relativeIdInfo";
import { DbMixedInfo, FeMixedInfo, SectionNameProp } from "./baseSectionInfo";
import { BaseName } from "./baseSectionTypes";

interface RandomStringInfoMixed<
  SN extends SimpleSectionName = SimpleSectionName
> extends NanoIdInfo,
    SectionNameProp<SN> {}

export interface RelSectionInfo<
  SN extends SimpleSectionName = SimpleSectionName
> extends RelIdInfo,
    SectionNameProp<SN> {}

export type MultiSectionInfo<SN extends SimpleSectionName = SimpleSectionName> =
  RandomStringInfoMixed<SN> | RelSectionInfo<SN>;

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
> = RandomStringInfoMixed<S> | RelFindByFocalInfo<S>;

// varbInfo
export type VarbProp = { varbName: string };

export type SpecificVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">
> = SpecificSectionInfo<S> & { varbName: string };

export interface FeVarbInfoMixed<SN extends BaseName = BaseName<"hasVarb">>
  extends FeMixedInfo<SN>,
    VarbProp {}
export interface DbVarbInfo<S extends BaseName<"hasVarb"> = BaseName<"hasVarb">>
  extends DbMixedInfo<S>,
    VarbProp {}
export interface RelVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">
> extends RelSectionInfo<S>,
    VarbProp {}

export type DbUserDefVarbInfo<
  S extends BaseName<"uniqueDbId"> = BaseName<"uniqueDbId">
> = DbUserDefInfo<S> & VarbProp;

export type MultiVarbInfo<S extends BaseName<"hasVarb"> = BaseName<"hasVarb">> =
  MultiSectionInfo<S> & VarbProp;
export type MultiFindByFocalVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">
> = MultiFindByFocalInfo<S> & VarbProp;

export type VarbNames<SN extends SimpleSectionName = SimpleSectionName> = {
  varbName: string;
  sectionName: SN;
};
export function isValidVarbNames({ sectionName, varbName }: VarbNames) {
  const varbNames = Obj.keys(
    baseSections.fe[sectionName].varbSchemas
  ) as string[];
  if (varbNames.includes(varbName)) return true;
  else return false;
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
    VarbProp {}

interface RelFindByFocalInfo<S extends SimpleSectionName = SimpleSectionName>
  extends RelSectionInfo<S> {
  id: RelativeIds["focal"];
}

export interface RelFindByFocalVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">
> extends RelFindByFocalInfo<S>,
    VarbProp {}

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
  idType: z.literal("dbId" as NanoIdType),
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
