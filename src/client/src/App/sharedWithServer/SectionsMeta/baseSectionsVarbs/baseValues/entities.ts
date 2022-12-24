import { pick } from "lodash";
import { Schema } from "mongoose";
import { z } from "zod";
import { Arr } from "../../../utils/Arr";
import { zS } from "../../../utils/zod";
import { zSectionNameProp } from "../../baseSectionsDerived/baseSectionInfo";
import {
  DbVarbInfoMixed,
  GlobalVarbInfo,
} from "../../baseSectionsDerived/baseVarbInfo";
import { PathInVarbInfo } from "../../sectionChildrenDerived/RelInOutVarbInfo";
import { FeVarbInfo } from "../../SectionInfo/FeInfo";
import {
  PathDbVarbInfoMixed,
  VarbPathNameInfoMixed,
  zSectionPathProp,
} from "../../SectionInfo/PathNameInfo";
import { SectionName } from "../../SectionName";
import { Id } from "../id";

type EntityIdProp = { entityId: string };
export type OutEntity = FeVarbInfo & EntityIdProp;

const commonEntityInfo = {
  ...zSectionNameProp.shape,
  expectedCount: z.literal("onlyOne"),
  varbName: zS.string,
};
const zInEntityBase = z.object({
  entityId: zS.nanoId,
  entitySource: zS.string,
  length: zS.number,
  offset: zS.number,
});

interface PathNameEntityInfo
  extends VarbPathNameInfoMixed<SectionName, "onlyOne"> {}

type PathEntityInfo = PathInVarbInfo;

const zPathInEntityInfo = zSectionPathProp.extend({
  ...commonEntityInfo,
  infoType: z.literal("pathName"),
});
const zPathInEntity = zInEntityBase.merge(zPathInEntityInfo);

interface PathNameDbIdEntityInfo
  extends PathDbVarbInfoMixed<SectionName, "onlyOne"> {}
const zPathDbIdInEntityInfo = zSectionPathProp.extend({
  ...commonEntityInfo,
  infoType: z.literal("pathNameDbId"),
  id: zS.nanoId,
});
const zPathDbIdInEntity = zInEntityBase.merge(zPathDbIdInEntityInfo);

// this must be exported for InEntityIdInfoValue.zInEntityVarbInfoValue
export interface GlobalInEntityInfo
  extends GlobalVarbInfo<SectionName, "onlyOne"> {}
const zGlobalInEntityInfo = z.object({
  ...commonEntityInfo,
  infoType: z.literal("globalSection"),
} as Record<keyof GlobalInEntityInfo, any>);
const zGlobalInEntity = zInEntityBase.merge(zGlobalInEntityInfo);

export interface DbInEntityInfo
  extends DbVarbInfoMixed<SectionName, "onlyOne"> {}
const zDbInEntityInfo = z.object({
  ...commonEntityInfo,
  infoType: z.literal("dbId" as DbInEntityInfo["infoType"]),
  id: zS.nanoId,
} as Record<keyof DbInEntityInfo, any>);
const zDbInEntity = zInEntityBase.merge(zDbInEntityInfo);

type InEntityVarbInfos = {
  dbId: DbInEntityInfo;
  global: GlobalInEntityInfo;
  pathName: PathNameEntityInfo;
  pathNameDbId: PathNameDbIdEntityInfo;
  path: PathEntityInfo;
};
export type InEntityVarbInfo = InEntityVarbInfos[keyof InEntityVarbInfos];
export const zInEntityVarbInfo = z.union([
  zDbInEntityInfo,
  zGlobalInEntityInfo,
  zPathInEntityInfo,
  zPathDbIdInEntityInfo,
]);
export const zInEntity = z.union([
  zPathInEntity,
  zPathDbIdInEntity,
  zDbInEntity,
  zGlobalInEntity,
]);

export const zInEntities = z.array(zInEntity);
export type InEntityBase = z.infer<typeof zInEntityBase>;
interface DbInEntity extends InEntityBase, DbInEntityInfo {}
export interface AbsoluteInEntity extends InEntityBase, PathNameEntityInfo {}
interface AbsoluteDbIdInEntity extends InEntityBase, PathNameDbIdEntityInfo {}
export interface GlobalInEntity extends InEntityBase, GlobalInEntityInfo {}

export type ValueInEntityInfo =
  | DbInEntityInfo
  | GlobalInEntityInfo
  | PathNameEntityInfo
  | PathNameDbIdEntityInfo;

export type FixedInEntity = PathEntityInfo & EntityIdProp;
export type ValueInEntity =
  | DbInEntity
  | GlobalInEntity
  | AbsoluteInEntity
  | AbsoluteDbIdInEntity;

export type InEntity = FixedInEntity | ValueInEntity;

// As things stand, I can't infer much from the zod schemas because
// there isn't a convenient way to make their sectionName enforce SectionNameByType
export const mInEntities = {
  type: Schema.Types.Mixed,
  required: true,
  validate: {
    validator: (v: any) => zInEntities.safeParse(v).success,
  },
};

export type EntitySource = "localValueEntityInfo" | "editor";

export const entityS = {
  inEntity(
    varbInfo: InEntityVarbInfo,
    entityInfo: {
      offset: number;
      length: number;
      entitySource: EntitySource;
    }
  ): InEntity {
    return {
      entityId: Id.make(),
      ...varbInfo,
      ...entityInfo,
    };
  },
  outEntity(feVarbInfo: FeVarbInfo, inEntity: ValueInEntity): OutEntity {
    return {
      ...feVarbInfo,
      ...pick(inEntity, ["entityId"]),
    };
  },
  outEntitiesHas(entities: OutEntity[], info: OutEntityInfo): boolean {
    return Arr.has(entities, (e) => isInfoForOutEntity(e, info));
  },
  outEntitiesCopyRm(entities: OutEntity[], info: OutEntityInfo): OutEntity[] {
    return entities.filter((e) => !isInfoForOutEntity(e, info));
  },
  inEntitiesHas(entities: ValueInEntity[], entity: ValueInEntity): boolean {
    return Arr.has(entities, (e) => e.entityId === entity.entityId);
  },
} as const;

function isInfoForOutEntity(outEntity: OutEntity, info: OutEntityInfo) {
  return (
    outEntity.entityId === info.entityId && // differentiates multiple from the same varb
    outEntity.feId === info.feId && // differentiates inEntites between sections
    outEntity.varbName === info.varbName // differentiates local inEntities
  );
}

export type EntityMapData = ValueInEntityInfo & EntityIdProp;
export interface OutEntityInfo extends EntityIdProp {
  feId: string;
  varbName: string;
}
