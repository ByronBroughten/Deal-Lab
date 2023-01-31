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
  PathNameVarbInfoMixed,
  zSectionPathProp,
} from "../../SectionInfo/PathNameInfo";
import { Id } from "../id";

type EntityIdProp = { entityId: string };
export type OutEntity = FeVarbInfo & EntityIdProp;

const commonEntityInfo = {
  ...zSectionNameProp.shape,
  varbName: zS.string,
};

const zInEntityBase = z.object({
  entityId: zS.nanoId,
  entitySource: zS.string,
  length: zS.number,
  offset: zS.number,
});

const zPathInEntityInfo = zSectionPathProp.extend({
  ...commonEntityInfo,
  infoType: z.literal("pathName"),
});
const zPathInEntity = zInEntityBase.merge(zPathInEntityInfo);

const zPathDbIdInEntityInfo = zSectionPathProp.extend({
  ...commonEntityInfo,
  infoType: z.literal("pathNameDbId"),
  id: zS.nanoId,
});
const zPathDbIdInEntity = zInEntityBase.merge(zPathDbIdInEntityInfo);

// this must be exported for InEntityIdInfoValue.zInEntityVarbInfoValue
const zGlobalInEntityInfo = z.object({
  ...commonEntityInfo,
  infoType: z.literal("globalSection"),
} as Record<keyof GlobalVarbInfo, any>);
const zGlobalInEntity = zInEntityBase.merge(zGlobalInEntityInfo);

const zDbInEntityInfo = z.object({
  ...commonEntityInfo,
  infoType: z.literal("dbId" as DbVarbInfoMixed["infoType"]),
  id: zS.nanoId,
} as Record<keyof DbVarbInfoMixed, any>);
const zDbInEntity = zInEntityBase.merge(zDbInEntityInfo);

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
interface DbInEntity extends InEntityBase, DbVarbInfoMixed {}
export interface PathNameInEntity extends InEntityBase, PathNameVarbInfoMixed {}
interface PathNameDbIdInEntity extends InEntityBase, PathDbVarbInfoMixed {}
export interface GlobalInEntity extends InEntityBase, GlobalVarbInfo {}

export type InEntityVarbInfo =
  | DbVarbInfoMixed
  | GlobalVarbInfo
  | PathDbVarbInfoMixed
  | PathNameVarbInfoMixed
  | PathInVarbInfo;

export type ValueInEntityInfo =
  | DbVarbInfoMixed
  | GlobalVarbInfo
  | PathNameVarbInfoMixed
  | PathDbVarbInfoMixed;

export type FixedInEntity = PathInVarbInfo & EntityIdProp;
export type ValueInEntity =
  | DbInEntity
  | GlobalInEntity
  | PathNameInEntity
  | PathNameDbIdInEntity;

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
  inEntitiesHas(entities: ValueInEntity[], entity: ValueInEntity): boolean {
    return Arr.has(entities, (e) => e.entityId === entity.entityId);
  },
} as const;

export type EntityMapData = ValueInEntityInfo & EntityIdProp;
export interface OutEntityInfo extends EntityIdProp {
  feId: string;
  varbName: string;
}
