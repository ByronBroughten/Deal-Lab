import { pick } from "lodash";
import { Schema } from "mongoose";
import { z } from "zod";
import { zNumber, zS, zString } from "../../../utils/zod";
import { zSectionNameProp } from "../../baseSectionsDerived/baseSectionInfo";
import {
  DbVarbInfoMixed,
  FeVarbInfoMixed,
  GlobalVarbInfo,
} from "../../baseSectionsDerived/baseVarbInfo";
import {
  PathDbVarbInfoMixed,
  PathVarbInfoMixed,
  zSectionPathProp,
} from "../../PathInfo";
import { SectionName } from "../../SectionName";
import { Id } from "../id";

export type OutEntity = FeVarbInfoMixed & { entityId: string };

const commonEntityInfo = {
  ...zSectionNameProp.shape,
  expectedCount: z.literal("onlyOne" as GlobalInEntityInfo["expectedCount"]),
  varbName: zS.string,
};

export interface PathEntityInfo
  extends PathVarbInfoMixed<SectionName, "onlyOne"> {}

const zPathInEntityInfo = zSectionPathProp.extend({
  ...commonEntityInfo,
  infoType: z.literal("absolutePath"),
});

export interface PathDbIdEntityInfo
  extends PathDbVarbInfoMixed<SectionName, "onlyOne"> {}
const zPathDbIdInEntityInfo = zSectionPathProp.extend({
  ...commonEntityInfo,
  infoType: z.literal("absolutePathDbId"),
  id: zS.nanoId,
});

export interface GlobalInEntityInfo
  extends GlobalVarbInfo<SectionName, "onlyOne"> {}
const zGlobalInEntityInfo = z.object({
  ...commonEntityInfo,
  infoType: z.literal("globalSection" as GlobalInEntityInfo["infoType"]),
} as Record<keyof GlobalInEntityInfo, any>);

export interface DbInEntityInfo
  extends DbVarbInfoMixed<SectionName, "onlyOne"> {}
const zDbInEntityInfo = z.object({
  ...commonEntityInfo,
  infoType: z.literal("dbId" as DbInEntityInfo["infoType"]),
  id: zS.nanoId,
} as Record<keyof DbInEntityInfo, any>);

type InEntityVarbInfos = {
  dbId: DbInEntityInfo;
  global: GlobalInEntityInfo;
  absolutePath: PathEntityInfo;
  absolutePathDbId: PathDbIdEntityInfo;
};
export type InEntityVarbInfo = InEntityVarbInfos[keyof InEntityVarbInfos];
export const zInEntityVarbInfo = z.union([
  zDbInEntityInfo,
  zGlobalInEntityInfo,
  zPathInEntityInfo,
  zPathDbIdInEntityInfo,
]);

const zInEntityBase = z.object({
  // things depend on a new entityId being created every time
  // a new entity is created
  entityId: zString,
  entitySource: zString,
  length: zNumber,
  offset: zNumber,
});

const zDbInEntity = zInEntityBase.merge(zDbInEntityInfo);
const zGlobalInEntity = zInEntityBase.merge(zGlobalInEntityInfo);
export const zInEntity = z.union([zDbInEntity, zGlobalInEntity]);
export const zInEntities = z.array(zInEntity);
type InEntityBase = z.infer<typeof zInEntityBase>;
interface DbInEntity extends InEntityBase, DbInEntityInfo {}
interface DescendantInEntity extends InEntityBase, PathEntityInfo {}
interface DescendantDbInEntity extends InEntityBase, PathDbIdEntityInfo {}
export interface GlobalInEntity extends InEntityBase, GlobalInEntityInfo {}

export type InEntity =
  | DbInEntity
  | GlobalInEntity
  | DescendantInEntity
  | DescendantDbInEntity;
export type InEntities = InEntity[];
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
  outEntity(feVarbInfo: FeVarbInfoMixed, inEntity: InEntity): OutEntity {
    return {
      ...feVarbInfo,
      ...pick(inEntity, ["entityId"]),
    };
  },
  entitiesHas(
    entities: (InEntity | OutEntity)[],
    entity: InEntity | OutEntity
  ): boolean {
    const match = entities.find((e) => e.entityId === entity.entityId);
    if (match) return true;
    else return false;
  },
} as const;

export type EntityMapData = InEntityVarbInfo & { entityId: string };
