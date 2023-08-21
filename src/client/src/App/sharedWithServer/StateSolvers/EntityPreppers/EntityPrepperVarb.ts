import { VarbInfoMixedFocal } from "../../SectionsMeta/SectionInfo/MixedSectionInfo";
import {
  InEntity,
  OutEntity,
  OutEntityInfo,
} from "../../SectionsMeta/values/StateValue/valuesShared/entities";
import { GetterVarbBase } from "../../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { InEntityGetterVarb } from "../../StateGetters/InEntityGetterVarb";
import { OutEntityGetterVarb } from "../../StateInOutVarbs/OutEntityGetterVarb";
import { UpdaterVarb } from "../../StateUpdaters/UpdaterVarb";
import { SectionName } from "./../../SectionsMeta/SectionName";

export class EntityPrepperVarb<
  SN extends SectionName = SectionName
> extends GetterVarbBase<SN> {
  get get() {
    return new GetterVarb(this.getterVarbProps);
  }
  get inEntity() {
    return new InEntityGetterVarb(this.getterVarbProps);
  }
  get outEntity() {
    return new OutEntityGetterVarb(this.getterVarbProps);
  }
  get updaterVarb(): UpdaterVarb<SN> {
    return new UpdaterVarb(this.getterVarbProps);
  }
  private newSelfOutEntity(inEntityId: string): OutEntity {
    return {
      ...this.get.feVarbInfo,
      entityId: inEntityId,
    };
  }
  varbsByFocalMixed(info: VarbInfoMixedFocal) {
    const getterVarbs = this.get.varbsByFocalMixed(info);
    return getterVarbs.map(
      (varb) =>
        new EntityPrepperVarb({
          ...this.getterSectionsProps,
          ...varb.feVarbInfo,
        })
    );
  }
  removeAllOutEntitiesOfInEntities(throwArmed: boolean = true) {
    const { allInEntities } = this.inEntity;
    this.removeOutEntitiesOfInEntities(allInEntities, throwArmed);
  }
  private removeOutEntitiesOfInEntities(
    inEntities: InEntity[],
    throwArmed: boolean
  ) {
    for (const inEntity of inEntities) {
      const inVarbs = this.getInEntityVarbs(inEntity);
      for (const inVarb of inVarbs) {
        inVarb.removeOutEntity(
          {
            entityId: inEntity.entityId,
            feId: this.get.feId,
            varbName: this.get.varbName,
          },
          throwArmed
        );
      }
    }
  }
  private getInEntityVarbs(inEntity: InEntity): EntityPrepperVarb[] {
    const varbs = this.get.varbsByFocalMixed(inEntity);
    return varbs.map(
      ({ feVarbInfo }) =>
        new EntityPrepperVarb({
          ...this.getterSectionsProps,
          ...feVarbInfo,
        })
    );
  }
  private removeOutEntity(info: OutEntityInfo, throwArmed: boolean): void {
    if (!this.outEntity.hasOutEntity(info) && throwArmed) {
      throw new Error("Tried to remove entity, but entity not found.");
    }
    const nextOutEntities = this.outEntity.outEntitiesWithout(info);
    this.updaterVarb.update({
      outEntities: nextOutEntities,
    });
  }
  addOutEntitiesFromAllInEntities(): void {
    const { allInEntities } = this.inEntity;
    for (const entity of allInEntities) {
      const entityVarbs = this.varbsByFocalMixed(entity);
      for (const inEntityVarb of entityVarbs) {
        const outEntity = this.newSelfOutEntity(entity.entityId);
        if (!inEntityVarb.outEntity.hasOutEntity(outEntity)) {
          inEntityVarb.addOutEntity(outEntity);
        }
      }
    }
  }
  private addOutEntity(outEntity: OutEntity): void {
    const nextOutEntities = [...this.outEntity.outEntities, outEntity];
    this.updaterVarb.update({ outEntities: nextOutEntities });
  }
}
