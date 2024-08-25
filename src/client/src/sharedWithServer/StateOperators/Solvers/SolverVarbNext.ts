import {
  GetterVarbBase,
  GetterVarbProps,
} from "../../StateGetters/Bases/GetterVarbBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { GetterSections } from "../../StateGetters/GetterSections";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { VarbInfoMixedFocal } from "../../StateGetters/Identifiers/MixedSectionInfo";
import { InEntityGetterVarb } from "../../StateGetters/InEntityGetterVarb";
import { SectionName } from "../../stateSchemas/SectionName";
import { StateValue } from "../../stateSchemas/StateValue";
import {
  entityS,
  InEntity,
  OutEntity,
  OutEntityInfo,
  ValueInEntity,
} from "../../stateSchemas/StateValue/stateValuesShared/entities";
import { OutEntityGetterVarb } from "../OutEntityGetters/OutEntityGetterVarb";
import { SolverBase } from "../SolverBases/SolverBase";
import { SolverVarbProps } from "../SolverBases/SolverVarbBase";
import { UpdaterVarb } from "../Updaters/UpdaterVarb";
import { SolverProps } from "./Solver";
import { SolveValueVarb } from "./ValueUpdateVarb";

interface SolverVarbPropsNext<SN extends SectionName>
  extends SolverProps,
    GetterVarbProps<SN> {}

class SolverVarbBaseNext<SN extends SectionName> extends SolverBase {
  readonly getterVarbBase: GetterVarbBase<SN>;
  constructor(props: SolverVarbPropsNext<SN>) {
    super(props);
    this.getterVarbBase = new GetterVarbBase(props);
  }
}

export class SolverVarbNext<
  SN extends SectionName = SectionName
> extends SolverVarbBaseNext<SN> {
  private initialValueEntities: ValueInEntity[];
  constructor(props: SolverVarbProps<SN>) {
    super(props);
    this.initialValueEntities = [...this.inEntity.valueInEntities];
  }
  get get() {
    return new GetterVarb(this.getterVarbBase.getterVarbProps);
  }
  get inEntity() {
    return new InEntityGetterVarb(this.getterVarbBase.getterVarbProps);
  }
  get outEntity() {
    return new OutEntityGetterVarb(this.getterVarbBase.getterVarbProps);
  }
  get getterSections() {
    return new GetterSections(this.getterSectionsBase.getterSectionsProps);
  }
  get updaterVarb() {
    return new UpdaterVarb(this.getterVarbBase.getterVarbProps);
  }
  private get valueSolver() {
    return new SolveValueVarb(this.getterVarbBase.getterVarbProps);
  }
  private get getterSection() {
    return new GetterSection(this.getterVarbBase.getterVarbProps);
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
  solveAndUpdateValue() {
    const newValue = this.valueSolver.solveValue();
    this.updateValue(newValue);
  }
  private updateValue(newValue: StateValue): void {
    this.updaterVarb.updateValue(newValue);
    this.updateConnectedEntities();
  }
  private updateConnectedEntities() {
    this.removeObsoleteOutEntities();
    this.addNewOutEntitites();
    this.initialValueEntities = [...this.inEntity.valueInEntities];
  }
  private addNewOutEntitites() {
    const { newValueInEntities } = this;
    this.addOutEntitiesFromNewValueIn(newValueInEntities);
  }
  private get newValueInEntities(): ValueInEntity[] {
    const { initialValueEntities, nextValueEntities } =
      this.initialAndNextEntities;
    return nextValueEntities.filter(
      (entity) => !entityS.inEntitiesHas(initialValueEntities, entity)
    );
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
  private newSelfOutEntity(inEntityId: string): OutEntity {
    return {
      ...this.get.feVarbInfo,
      entityId: inEntityId,
    };
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

  private addOutEntity(outEntity: OutEntity): void {
    const nextOutEntities = [...this.outEntity.outEntities, outEntity];
    this.updaterVarb.update({ outEntities: nextOutEntities });
  }

  private getInEntityVarb(inEntity: ValueInEntity): SolverVarbNext {
    const varb = this.getterSection.varbByFocalMixed(inEntity);
    return new SolverVarbNext({
      ...this.solverProps,
      ...varb.feVarbInfo,
    });
  }

  private removeObsoleteOutEntities() {
    const { missingEntities } = this;
    this.removeOutEntitiesOfInEntities(missingEntities);
  }
  private get missingEntities(): ValueInEntity[] {
    const { initialValueEntities, nextValueEntities } =
      this.initialAndNextEntities;
    return initialValueEntities.filter(
      (entity) => !entityS.inEntitiesHas(nextValueEntities, entity)
    );
  }
  private removeOutEntitiesOfInEntities(inEntities: InEntity[]) {
    for (const inEntity of inEntities) {
      const inVarbs = this.getInEntityVarbs(inEntity);
      for (const inVarb of inVarbs) {
        inVarb.removeOutEntity({
          entityId: inEntity.entityId,
          feId: this.get.feId,
          varbName: this.get.varbName,
        });
      }
    }
  }
  private removeOutEntity(info: OutEntityInfo): void {
    if (!this.outEntity.hasOutEntity(info)) {
      throw new Error("Tried to remove entity, but entity not found.");
    }
    const nextOutEntities = this.outEntity.outEntitiesWithout(info);
    this.updaterVarb.update({
      outEntities: nextOutEntities,
    });
  }
  private getInEntityVarbs(inEntity: InEntity): SolverVarbNext[] {
    const varbs = this.get.varbsByFocalMixed(inEntity);
    return varbs.map(
      ({ feVarbInfo }) =>
        new SolverVarbNext({
          ...this.solverProps,
          ...feVarbInfo,
        })
    );
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
  private varbsByFocalMixed(info: VarbInfoMixedFocal): SolverVarbNext[] {
    const getterVarbs = this.get.varbsByFocalMixed(info);
    return getterVarbs.map(
      (varb) =>
        new SolverVarbNext({
          ...this.solverProps,
          ...varb.feVarbInfo,
        })
    );
  }
}
