import { pick } from "lodash";
import { Schema } from "mongoose";
import { z } from "zod";
import { zNumber, zS, zString } from "../../../utils/zod";
import { SimpleSectionName } from "../../baseSections";
import { zSectionNameProp } from "../../baseSectionsDerived/baseSectionInfo";
import {
  DbVarbInfoMixed,
  FeVarbInfoMixed,
  GlobalVarbInfo,
} from "../../baseSectionsDerived/baseVarbInfo";
import { Id } from "../id";

export type OutEntity = FeVarbInfoMixed & { entityId: string };

export interface DbInEntityInfo
  extends DbVarbInfoMixed<SimpleSectionName, "onlyOne"> {}
const zDbInEntityInfo = z.object({
  ...zSectionNameProp.shape,
  infoType: z.literal("dbId" as DbInEntityInfo["infoType"]),
  expectedCount: z.literal("onlyOne" as DbInEntityInfo["expectedCount"]),
  id: zS.nanoId,
  varbName: zS.string,
} as Record<keyof DbInEntityInfo, any>);

export interface GlobalInEntityInfo
  extends GlobalVarbInfo<SimpleSectionName, "onlyOne"> {}
const zGlobalInEntityInfo = z.object({
  ...zSectionNameProp.shape,
  infoType: z.literal("globalSection" as GlobalInEntityInfo["infoType"]),
  expectedCount: z.literal("onlyOne" as GlobalInEntityInfo["expectedCount"]),
  varbName: zS.string,
} as Record<keyof GlobalInEntityInfo, any>);

export type InEntityVarbInfo = DbInEntityInfo | GlobalInEntityInfo;
export const zInEntityVarbInfo = z.union([
  zDbInEntityInfo,
  zGlobalInEntityInfo,
]);

// this should probably be moved to SolverVarb or something
export type InVarbInfo = InEntity | FeVarbInfoMixed;

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
interface GlobalInEntity extends InEntityBase, GlobalInEntityInfo {}
export type InEntity = DbInEntity | GlobalInEntity;
export type InEntities = InEntity[];
// As things stand, I can't infer much from the zod schemas because
// there isn't a convenient way to make their sectionName enforce SectionName

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
