import { pick } from "lodash";
import { Schema } from "mongoose";
import { z } from "zod";
import { Arr } from "../../../utils/Arr";
import { zS } from "../../../utils/zod";
import { PathInVarbInfo } from "../../sectionChildrenDerived/RelInOutVarbInfo";
import { FeVarbInfo } from "../../SectionInfo/FeInfo";
import { PathDbVarbInfoMixed } from "../../SectionInfo/PathNameInfo";
import { VarbPathNameInfoMixed } from "../../SectionInfo/VarbPathNameInfo";
import { Id } from "../id";

export type EntityIdProp = { entityId: string };
export type OutEntity = FeVarbInfo & EntityIdProp;

const zValueInEntityBase = z.object({
  entityId: zS.nanoId,
  entitySource: zS.string,
  length: zS.number,
  offset: zS.number,
});

interface InEntityBase extends z.infer<typeof zValueInEntityBase> {
  entitySource: EntitySource;
}

const varbPathZSchema: Record<keyof VarbPathNameInfoMixed, any> = {
  infoType: z.literal("varbPathName"),
  varbPathName: zS.string,
};

const pathDbIdZSchema: Record<keyof PathDbVarbInfoMixed, any> = {
  infoType: z.literal("pathNameDbId"),
  pathName: zS.string,
  varbName: zS.string,
  id: zS.nanoId,
};

export const zValueEntityInfo = z.union([
  z.object(varbPathZSchema),
  z.object(pathDbIdZSchema),
]);

export const zValueInEntity = z.union([
  zValueInEntityBase.extend(varbPathZSchema),
  zValueInEntityBase.extend(pathDbIdZSchema),
]);

export const zValueInEntities = z.array(zValueInEntity);

export type ValueInEntityInfo =
  | PathDbVarbInfoMixed<any>
  | VarbPathNameInfoMixed;

type FixedInEntityInfo = PathInVarbInfo;
export type FixedInEntity = FixedInEntityInfo & EntityIdProp;

export type ValueInEntity = ValueInEntityInfo & InEntityBase;
export type InEntity = FixedInEntity | ValueInEntity;

// As things stand, we can't infer much from the zod schemas because
// there isn't a convenient way to make their sectionName enforce SectionNameByType
export const mInEntities = {
  type: Schema.Types.Mixed,
  required: true,
  validate: {
    validator: (v: any) => zValueInEntities.safeParse(v).success,
  },
};

export type EntitySource = "localValueEntityInfo" | "editor";

export const entityS = {
  valueInEntity(
    varbInfo: ValueInEntityInfo,
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
