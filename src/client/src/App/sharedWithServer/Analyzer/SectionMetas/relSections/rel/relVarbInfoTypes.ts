import { z } from "zod";
import { BaseName } from "../baseNameArrs";

// fix this after you fix relSections

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

type AbsoluteSectionInfo<S extends BaseName, E extends object = {}> =
  | FeNameInfo<S, E>
  | DbNameInfo<S, E>;

export type MultiSectionInfo<
  S extends BaseName = BaseName,
  E extends object = {}
> = AbsoluteSectionInfo<S, E> | RelSectionInfo<S, E>;

// this doesn't work
export type SpecificSectionInfo<
  S extends BaseName = BaseName,
  E extends object = {}
> =
  | AbsoluteSectionInfo<S, E>
  | StaticRelInfo<Extract<S, BaseName<"alwaysOne">>, E>;

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

export function isStaticMultiInfo(
  info: MultiSectionInfo
): info is SpecificSectionInfo {
  const { id, idType } = info;
  return ["feId", "dbId"].includes(idType as any) || id === "static";
}
export function isSingleMultiInfo(
  info: MultiSectionInfo
): info is MultiFindByFocalInfo {
  const { id } = info;
  return isStaticMultiInfo(info) || ["parent", "local"].includes(id);
}

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
export type VarbNames<S extends BaseName> = z.infer<typeof zVarbNames> & {
  varbName: string;
  sectionName: S;
};

// relative infos
export type ImmutableRelVarbInfo = z.infer<typeof zImmutableRelVarbInfo>;
export type LocalRelVarbInfo = RelVarbInfo & { id: "local" };

//
export type StaticRelInfo<
  S extends BaseName<"alwaysOne"> = BaseName<"alwaysOne">,
  E extends object = {}
> = RelSectionInfo<S, E> & {
  id: "static";
} & E;

export type StaticRelVarbInfo<
  S extends BaseName<"alwaysOneHasVarb"> = BaseName<"alwaysOneHasVarb">
> = StaticRelInfo<S, VarbParam>;

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
export type InRelVarbInfo = RelVarbInfo & { id: Relative<"inVarb"> };
export type OutRelVarbInfo = RelVarbInfo & { id: Relative<"outVarb"> };
