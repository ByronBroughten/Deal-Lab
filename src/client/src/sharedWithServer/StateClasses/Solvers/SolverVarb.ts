import { Id } from "../../Ids/IdS";
import { VarbInfoMixedFocal } from "../../SectionInfo/MixedSectionInfo";
import { ValueInEntityInfo } from "../../SectionInfo/ValueInEntityInfo";
import { FeVarbInfoMixed } from "../../SectionInfo/VarbInfoBase";
import { SectionNameByType } from "../../SectionNameByType";
import { StateSections } from "../../State/StateSections";
import { GetterSections } from "../../StateGetters/GetterSections";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { InEntityGetterVarb } from "../../StateGetters/InEntityGetterVarb";
import { StateValue } from "../../sectionVarbsConfig/StateValue";
import {
  InEntity,
  OutEntity,
  OutEntityInfo,
  ValueInEntity,
  entityS,
} from "../../sectionVarbsConfig/StateValue/stateValuesShared/entities";
import { StrictOmit } from "../../utils/types";
import { EntityPrepperVarb } from "../EntityPreppers/EntityPrepperVarb";
import { OutEntityGetterVarb } from "../OutEntityGetters/OutEntityGetterVarb";
import { PackBuilderSections } from "../Packers/PackBuilderSections";
import { SolverSectionsBase } from "../SolverBases/SolverSectionsBase";
import { SolverVarbBase, SolverVarbProps } from "../SolverBases/SolverVarbBase";
import { UpdaterVarb } from "../Updaters/UpdaterVarb";
import { SolverSection } from "./SolverSection";
import { SolverSections } from "./SolverSections";
import { SolveValueVarb } from "./ValueUpdateVarb";

type InitSolverVarbProps<SN extends SectionNameByType> = StrictOmit<
  SolverVarbProps<SN>,
  "solveShare"
>;

export class SolverVarb<
  SN extends SectionNameByType<"hasVarb"> = SectionNameByType<"hasVarb">
> extends SolverVarbBase<SN> {
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
  get entity() {
    return new EntityPrepperVarb(this.getterVarbBase.getterVarbProps);
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
  private get solverSection() {
    return new SolverSection(this.solverSectionProps);
  }
  private get solverSections() {
    return new SolverSections(this.solverSectionsProps);
  }
  get builderSections() {
    return new PackBuilderSections(this.getterSectionProps);
  }
  get stateSections(): StateSections {
    return this.sectionsShare.sections;
  }
  localSolverVarb(varbName: string): SolverVarb<SN> {
    return new SolverVarb({
      ...this.solverSectionProps,
      varbName,
    });
  }
  static init<SN extends SectionNameByType>(
    props: InitSolverVarbProps<SN>
  ): SolverVarb<SN> {
    return new SolverVarb({
      ...props,
      solveShare: SolverSectionsBase.initSolveShare(),
    });
  }
  directUpdateAndSolve(value: StateValue): void {
    this.updateValue(value);
    this.addVarbIdsToSolveFor(this.get.varbId);
    this.solveOutVarbs();
  }
  editorUpdateAndSolve(newValue: StateValue): void {
    this.updateValue(newValue);
    this.solveOutVarbs();
  }
  private updateValue(newValue: StateValue): void {
    this.updaterVarb.updateValue(newValue);
    this.updateConnectedEntities();
  }
  loadValueFromVarb(varbInfo: ValueInEntityInfo): void {
    const entityInfo = { ...varbInfo, entityId: Id.make() };
    const infoVarb = this.localSolverVarb("valueEntityInfo");
    infoVarb.updaterVarb.updateValue(entityInfo);

    this.updateConnectedEntities();
    this.solveOutVarbs();

    this.addInEntity({
      ...entityInfo,
      entitySource: "localValueEntityInfo",
      length: 0, // length and offset are arbitrary
      offset: 0, // just borrowing functionality from editor entities
    });
  }
  varbsByFocalMixed(info: VarbInfoMixedFocal) {
    const getterVarbs = this.get.varbsByFocalMixed(info);
    return getterVarbs.map((varb) =>
      SolverVarb.init({
        ...this.solverSectionsProps,
        ...varb.feVarbInfo,
      })
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

  removeAllOutEntitiesOfInEntities() {
    const { allInEntities } = this.inEntity;
    this.removeOutEntitiesOfInEntities(allInEntities);
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

  private newSelfOutEntity(inEntityId: string): OutEntity {
    return {
      ...this.get.feVarbInfo,
      entityId: inEntityId,
    };
  }
  private hasValueEntityVarb(inEntity: ValueInEntity) {
    return this.get.section.hasVarbByFocalMixed(inEntity);
  }
  getInEntityVarb(inEntity: ValueInEntity): SolverVarb {
    return this.solverSection.varbByFocalMixed(inEntity);
  }
  getInEntityVarbs(inEntity: InEntity): SolverVarb[] {
    const varbs = this.get.varbsByFocalMixed(inEntity);
    return varbs.map(
      ({ feVarbInfo }) =>
        new SolverVarb({
          ...this.solverSectionsProps,
          ...feVarbInfo,
        })
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
  private removeObsoleteOutEntities() {
    const { missingEntities } = this;
    this.removeOutEntitiesOfInEntities(missingEntities);
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
  private removeOutEntity(info: OutEntityInfo): void {
    if (!this.outEntity.hasOutEntity(info)) {
      throw new Error("Tried to remove entity, but entity not found.");
    }
    const nextOutEntities = this.outEntity.outEntitiesWithout(info);
    this.updaterVarb.update({
      outEntities: nextOutEntities,
    });
  }
  private addOutEntity(outEntity: OutEntity): void {
    const nextOutEntities = [...this.outEntity.outEntities, outEntity];
    this.updaterVarb.update({ outEntities: nextOutEntities });
  }
  private inEntitySectionExists(inEntity: ValueInEntity): boolean {
    if (this.hasValueEntityVarb(inEntity)) return true;
    else if (this.isUserVarbAndWasDeleted(inEntity)) return false;
    else {
      throw new Error("inEntity varb not found");
    }
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
  private solveOutVarbs(): void {
    this.addVarbInfosToSolveFor(...this.outEntity.activeOutEntities);
    this.solverSections.solve();
  }
  get hasInVarbs(): boolean {
    return this.inEntity.hasActiveInEntities;
  }
  private addInEntity(inEntity: ValueInEntity): void {
    this.updaterVarb.update({
      value: this.get.numObj.addEntity(inEntity),
    });
    this.addOutEntitiesFromNewValueIn([inEntity]);
  }
  private removeInEntity(inEntity: ValueInEntity): void {
    const { entityId } = inEntity;
    this.updaterVarb.update({
      value: this.get.numObj.removeEntity(entityId),
    });
    this.removeOutEntitiesOfInEntities([inEntity]);
  }
}

export function varbNotFoundMixed({
  varbName,
  sectionName,
  infoType,
}: {
  varbName: string;
  sectionName: string;
  infoType: string;
}) {
  return new Error(
    `There is no varb at ${sectionName}.${varbName} with infoType ${infoType}.`
  );
}

export type InVarbInfo = ValueInEntity | FeVarbInfoMixed;
