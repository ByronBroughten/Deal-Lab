import { z } from "zod";
import { MergeUnionObjNonNullable } from "../../../../utils/types/mergeUnionObj";
import { zNanoId, zString } from "../../../../utils/zod";
import { SectionContext, SimpleSectionName } from "../baseSections";
import { BaseName } from "../baseSectionTypes";

export const zSectionInfoBase = z.object({
  sectionName: zString,
});
export const zVarbNames = zSectionInfoBase.extend({
  varbName: zString,
});

const zFeSectionInfo = zSectionInfoBase.extend({
  idType: z.literal("feId"),
  id: zNanoId,
});
const zDbSectionInfo = zSectionInfoBase.extend({
  idType: z.literal("dbId"),
  id: zNanoId,
});

export type InVarbRelative = "children" | "local" | "static" | "all";
export type OutVarbRelative = "parent" | "local" | "static" | "all";
const zFocalRelative = z.union([
  z.literal("static"),
  z.literal("local"),
  z.literal("parent"),
]);
const zFocalMultiRelative = z.union([z.literal("children"), z.literal("all")]);
const zRelative = z.union([zFocalRelative, zFocalMultiRelative]);
const zRelSectionInfo = zSectionInfoBase.extend({
  id: zRelative,
  idType: z.literal("relative"),
});
const zFocalRelSectionInfo = zRelSectionInfo.extend({
  id: zFocalRelative,
});
const zImmutableRelSectionInfo = zRelSectionInfo.extend({
  id: z.literal("static"), // parent might go here eventually
});
export const zImmutableRelVarbInfo = zImmutableRelSectionInfo.extend({
  varbName: zString,
});

const zFeVarbInfo = zFeSectionInfo.merge(zVarbNames);
export const zDbVarbInfo = zDbSectionInfo.merge(zVarbNames);
export const zRelVarbInfo = zRelSectionInfo.merge(zVarbNames);

export type FeSectionInfoBase = z.infer<typeof zFeSectionInfo>;
export type FeNameInfo<
  S extends BaseName | "no parent" = BaseName,
  E extends object = {}
> = FeSectionInfoBase & {
  sectionName: S;
} & E;

// type BaseNameFeInfo<

export type DbNameInfo<
  S extends BaseName = BaseName,
  E extends object = {}
> = z.infer<typeof zDbSectionInfo> & {
  sectionName: S;
} & E;
export type RelSectionInfo<
  S extends BaseName = BaseName,
  E extends object = {}
> = z.infer<typeof zRelSectionInfo> & {
  sectionName: S;
} & E;

export type MultiSectionInfo<
  S extends BaseName = BaseName,
  E extends object = {}
> = FeNameInfo<S, E> | DbNameInfo<S, E> | RelSectionInfo<S, E>;

export type DbUserDefInfo<
  S extends BaseName<"userDefined"> | BaseName<"rowIndex"> =
    | BaseName<"userDefined">
    | BaseName<"rowIndex">,
  E extends object = {}
> = DbNameInfo<S> & E;
export type SpecificSectionInfo<
  S extends BaseName = BaseName,
  E extends object = {}
> =
  | FeNameInfo<S, E>
  | DbUserDefInfo<Extract<S, BaseName<"userDefined"> | BaseName<"rowIndex">>, E>
  | RelInfoStatic<Extract<S, BaseName<"alwaysOne">>, E>;

export type SpecificSectionsInfo<
  S extends BaseName = BaseName,
  E extends object = {}
> = SpecificSectionInfo<S, E> | DbNameInfo<S, E> | RelInfoAll<S, E>;

export type SpecificVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">
> = SpecificSectionInfo<S, { varbName: string }>;

function test(info: SpecificSectionInfo) {
  return;
}
const feInfo = {
  sectionName: "property",
  id: "string",
  idType: "feId",
  varbName: "price",
} as SpecificVarbInfo;
test(feInfo);

export type MultiFindByFocalInfo<
  S extends BaseName = BaseName,
  E extends object = {}
> = FeNameInfo<S, E> | DbNameInfo<S, E> | RelFindByFocalInfo<S, E>;

// varbInfo
export type VarbParam = { varbName: string };
export type FeVarbInfo<S extends BaseName<"hasVarb"> = BaseName<"hasVarb">> =
  FeNameInfo<S, VarbParam>;
export type DbVarbInfo<S extends BaseName<"hasVarb"> = BaseName<"hasVarb">> =
  DbNameInfo<S, VarbParam>;
export type DbUserDefVarbInfo<
  S extends BaseName<"userDefined"> = BaseName<"userDefined">
> = DbUserDefInfo<S, VarbParam>;

export type RelVarbInfo<S extends BaseName<"hasVarb"> = BaseName<"hasVarb">> =
  RelSectionInfo<S, VarbParam>;
export type MultiVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">,
  E extends object = {}
> = MultiSectionInfo<S, VarbParam & E>;
export type MultiFindByFocalVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">
> = MultiFindByFocalInfo<S, VarbParam>;

export type Relative = z.infer<typeof zRelative>;
export type SingleRelative = z.infer<typeof zFocalRelative>;

type VarbNameObj = {
  [SC in SectionContext]: {
    [SN in SimpleSectionName]: {
      varbName: string;
      sectionName: SN;
      sectionContext: SC;
    };
  };
};
export type NextVarbNames = VarbNameObj[SectionContext][SimpleSectionName];
export type SimpleVarbNames = {
  varbName: string;
  sectionName: SimpleSectionName;
};

export type VarbNames<
  SN extends SimpleSectionName<SC>,
  SC extends SectionContext = "fe"
> = z.infer<typeof zVarbNames> & {
  varbName: string;
  sectionName: SN;
  sectionContext: SC;
};

// relative infos
export type ImmutableRelVarbInfo = z.infer<typeof zImmutableRelVarbInfo>;
export type LocalRelVarbInfo = RelVarbInfo & { id: "local" };

//
export type RelInfoStatic<
  S extends BaseName<"alwaysOne"> = BaseName<"alwaysOne">,
  E extends object = {}
> = RelSectionInfo<S, E> & {
  id: "static";
} & E;
export type RelInfoAll<
  S extends BaseName,
  E extends object = {}
> = RelSectionInfo<S, E> & {
  id: "all";
} & E;

export type StaticRelVarbInfo<
  S extends BaseName<"alwaysOneHasVarb"> = BaseName<"alwaysOneHasVarb">
> = RelInfoStatic<S, VarbParam>;

//
type RelFindByFocalInfo<
  S extends BaseName = BaseName,
  E extends object = {}
> = z.infer<typeof zFocalRelSectionInfo> & {
  sectionName: S;
} & E;
export type RelFindByFocalVarbInfo<
  S extends BaseName<"hasVarb"> = BaseName<"hasVarb">
> = RelFindByFocalInfo<S, VarbParam>;

export type SingleInRelVarbInfo = Omit<InRelVarbInfo, "children" | "all">;
export type InRelVarbInfo = RelVarbInfo & { id: InVarbRelative };
export type OutRelVarbInfo = RelVarbInfo & { id: OutVarbRelative };
