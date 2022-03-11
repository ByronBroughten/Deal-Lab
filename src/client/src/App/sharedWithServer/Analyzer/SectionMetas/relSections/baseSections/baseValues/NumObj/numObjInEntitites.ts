import { z } from "zod";
import { zNanoId, zNumber, zString } from "../../../../../../utils/zod";
import { BaseInfo } from "../../../baseInfo";
import { BaseVarbInfo } from "../../../baseVarbInfo";

const zInEntityBase = z.object({
  entityId: zString,
  length: zNumber,
  offset: zNumber,
});

type InEntityBase = z.infer<typeof zInEntityBase>;
export type InEntityInfo = BaseInfo<"dbId"> | BaseInfo<"relAlwaysOne">;
export type InEntityVarbInfo =
  | BaseVarbInfo<"dbId">
  | BaseVarbInfo<"relAlwaysOne">;

type DbInEntity = InEntityBase & BaseVarbInfo<"dbId" | "hasVarb">;
type RelInEntity = InEntityBase & BaseVarbInfo<"relAlwaysOne">;
export type InEntity = DbInEntity | RelInEntity;
export type InEntities = InEntity[];

const zVarbInfo = z.object({
  id: zNanoId,
  idType: zString,
  varbName: zString,
  sectionName: zString,
  context: zString,
} as Record<keyof BaseVarbInfo<"dbId">, any>);
const zInEntity = z.union([zVarbInfo, zInEntityBase]);
export const zInEntities = z.array(zInEntity);
export type EntityMapData = InEntityVarbInfo & { entityId: string };
