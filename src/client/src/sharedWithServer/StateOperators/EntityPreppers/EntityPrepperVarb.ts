import {
  GetterVarbBase,
  GetterVarbProps,
} from "../../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { VarbInfoMixedFocal } from "../../StateGetters/Identifiers/MixedSectionInfo";
import { InEntityGetterVarb } from "../../StateGetters/InEntityGetterVarb";
import { SectionName } from "../../stateSchemas/SectionName";
import {
  entityS,
  InEntity,
  OutEntity,
  OutEntityInfo,
  ValueInEntity,
} from "../../stateSchemas/StateValue/stateValuesShared/entities";
import { OutEntityGetterVarb } from "../OutEntityGetters/OutEntityGetterVarb";
import { UpdaterVarb } from "../Updaters/UpdaterVarb";

export class EntityPrepperVarb<
  SN extends SectionName = SectionName
> extends GetterVarbBase<SN> {
  private initialValueEntities: ValueInEntity[];
  constructor(props: GetterVarbProps<SN>) {
    super(props);
    this.initialValueEntities = [...this.inEntity.valueInEntities];
  }
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
  getInEntityVarb(inEntity: ValueInEntity): EntityPrepperVarb {
    const varb = this.get.varbByFocalMixed(inEntity);
    return new EntityPrepperVarb(varb.getterVarbProps);
  }
  private get missingEntities(): ValueInEntity[] {
    const { initialValueEntities, nextValueEntities } =
      this.initialAndNextEntities;
    return initialValueEntities.filter(
      (entity) => !entityS.inEntitiesHas(nextValueEntities, entity)
    );
  }
  private get newValueInEntities(): ValueInEntity[] {
    const { initialValueEntities, nextValueEntities } =
      this.initialAndNextEntities;
    return nextValueEntities.filter(
      (entity) => !entityS.inEntitiesHas(initialValueEntities, entity)
    );
  }
  private get initialAndNextEntities(): {
    initialValueEntities: ValueInEntity[];
    nextValueEntities: ValueInEntity[];
  } {
    return {
      initialValueEntities: this.initialValueEntities,
      nextValueEntities: this.inEntity.valueInEntities,
    };
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
  updateConnectedEntities() {
    this.removeObsoleteOutEntities();
    this.addNewOutEntitites();
    this.initialValueEntities = [...this.inEntity.valueInEntities];
  }
  private removeObsoleteOutEntities() {
    const { missingEntities } = this;
    this.removeOutEntitiesOfInEntities(missingEntities, false);
  }
  private addNewOutEntitites() {
    const { newValueInEntities } = this;
    this.addOutEntitiesFromNewValueIn(newValueInEntities);
  }
  private addOutEntitiesFromNewValueIn(inEntities: ValueInEntity[]): void {
    for (const entity of inEntities) {
      if (this.inEntitySectionExists(entity)) {
        const inEntityVarb = this.getInEntityVarb(entity);
        const outEntity = this.newSelfOutEntity(entity.entityId);
        if (!inEntityVarb.outEntity.hasOutEntity(outEntity)) {
          inEntityVarb.addOutEntity(outEntity);
        }
      }
    }
  }
  private inEntitySectionExists(inEntity: ValueInEntity): boolean {
    if (this.hasValueEntityVarb(inEntity)) return true;
    else if (this.isUserVarbAndWasDeleted(inEntity)) return false;
    else {
      throw new Error("inEntity varb not found");
    }
  }
  private hasValueEntityVarb(inEntity: ValueInEntity) {
    return this.get.section.hasVarbByFocalMixed(inEntity);
  }
  private isUserVarbAndWasDeleted(varbInfo: ValueInEntity): boolean {
    if (
      varbInfo.infoType === "varbPathDbId" &&
      varbInfo.varbPathName === "userVarbValue"
    ) {
      return !this.hasValueEntityVarb(varbInfo);
    }
    return false;
  }
}
