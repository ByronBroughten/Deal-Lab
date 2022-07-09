import { pick } from "lodash";
import { z } from "zod";
import { zNumber, zS, zString } from "../../../utils/zod";
import { SimpleSectionName } from "../../baseSections";
import { zSectionNameProp } from "../../baseSectionsDerived/baseSectionInfo";
import {
  DbSectionVarbInfoMixed,
  FeVarbInfoMixed,
  GlobalVarbInfo,
} from "../../baseSectionsDerived/baseVarbInfo";
import { Id } from "../id";

export type OutEntity = FeVarbInfoMixed & { entityId: string };

type DbInEntityInfo = DbSectionVarbInfoMixed<SimpleSectionName, "onlyOne">;
type GlobalInEntityInfo = GlobalVarbInfo<SimpleSectionName, "onlyOne">;

export type InEntityVarbInfo = DbInEntityInfo | GlobalInEntityInfo;

const zDbInEntityInfo = z.object({
  ...zSectionNameProp.shape,
  infoType: z.literal("dbId" as DbInEntityInfo["infoType"]),
  expectedCount: z.literal("onlyOne" as DbInEntityInfo["expectedCount"]),
  id: zS.nanoId,
  varbName: zS.string,
} as Record<keyof DbInEntityInfo, any>);
const zGlobalInEntityInfo = z.object({
  ...zSectionNameProp.shape,
  infoType: z.literal("globalSection" as GlobalInEntityInfo["infoType"]),
  expectedCount: z.literal("onlyOne" as GlobalInEntityInfo["expectedCount"]),
  varbName: zS.string,
} as Record<keyof GlobalInEntityInfo, any>);

// this should probably be moved to SolverVarb or something
export type InVarbInfo = InEntity | FeVarbInfoMixed;

const zInEntityBase = z.object({
  entityId: zString,
  length: zNumber,
  offset: zNumber,
});

const zDbInEntity = zInEntityBase.merge(zDbInEntityInfo);
const zImmutableRelInEntity = zInEntityBase.merge(zGlobalInEntityInfo);
const zInEntity = z.union([zDbInEntity, zImmutableRelInEntity]);
export const zInEntities = z.array(zInEntity);
type InEntityBase = z.infer<typeof zInEntityBase>;
interface DbInEntity extends InEntityBase, DbInEntityInfo {}
interface GlobalInEntity extends InEntityBase, GlobalInEntityInfo {}
export type InEntity = DbInEntity | GlobalInEntity;
export type InEntities = InEntity[];
// As things stand, I can't infer much from the zod schemas because
// there isn't a convenient way to make their sectionName enforce SectionName

export const entityS = {
  inEntity(
    varbInfo: InEntityVarbInfo,
    entityInfo: { offset: number; length: number }
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
