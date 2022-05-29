import { OutEntity } from "../FeSections/FeSection/FeVarb/entities";
import { StateValue } from "../FeSections/FeSection/FeVarb/feValue";
import { varbNotFoundMixed } from "../FeSections/FeSection/FeVarbs";
import {
  entityS,
  InEntity,
  InEntityVarbInfo,
} from "../SectionsMeta/baseSections/baseValues/entities";
import { Id } from "../SectionsMeta/baseSections/id";
import { VarbInfo } from "../SectionsMeta/Info";
import { RelVarbInfo } from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import {
  OutDefaultPack,
  OutSwitchPack,
  VarbMeta,
} from "../SectionsMeta/VarbMeta";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { GetterVarbs } from "../StateGetters/GetterVarbs";
import { UpdaterVarb } from "../StateUpdaters/UpdaterVarb";
import { StrictOmit } from "../utils/types";
import { SolverVarbBase, SolverVarbProps } from "./SolverBases/SolverVarbBase";
import { SolverSections } from "./SolverSections";
import { ValueSolver } from "./SolveValueVarb";

type InitSolverVarbProps<SN extends SectionName> = StrictOmit<
  SolverVarbProps<SN>,
  "solveShare"
>;

export class SolverVarb<
  SN extends SectionName<"hasVarb">
> extends SolverVarbBase<SN> {
  private initialEntities: InEntity[];
  outVarbInfos: VarbInfo[];
  private getterVarb = new GetterVarb(this.getterVarbBase.getterVarbProps);
  constructor(props: SolverVarbProps<SN>) {
    super(props);
    this.initialEntities = [...this.getterVarb.inEntities];
    this.outVarbInfos = [];
    this.gatherOutVarbInfos();
  }
  // this is a fairly nasty problem.
  // for some reason, propertyGeneral has an outVarbInfo for
  // defaultLoan
  // I really don't need defaultLoan anymore
  // Default

  private getterSections = new GetterSections(this.sectionsShare);
  private getterVarbs = new GetterVarbs(
    this.getterSectionBase.getterSectionProps
  );
  private varbUpdater = new UpdaterVarb(this.getterVarbBase.getterVarbProps);
  private valueSolver = new ValueSolver(this.getterVarbBase.getterVarbProps);

  private solverSections = new SolverSections(this.solverSectionsProps);
  static init<SN extends SectionName>(
    props: InitSolverVarbProps<SN>
  ): SolverVarb<SN> {
    return new SolverVarb({
      ...props,
      solveShare: {
        varbFullNamesToSolveFor: new Set(),
      },
    });
  } // I definitely need editorUpdateAndSolve
  calculateAndUpdateValue() {
    const newValue = this.valueSolver.solveValue();
    this.varbUpdater.updateValueDirectly(newValue);
  }
  directUpdateAndSolve(value: StateValue): void {
    this.varbUpdater.updateValueDirectly(value);
    this.updateConnectedVarbs();
  }
  updateConnectedVarbs(): void {
    this.updateConnectedEntities();
    this.solveOutVarbs();
    this.initialEntities = [...this.getterVarb.inEntities];
  }
  private updateConnectedEntities() {
    this.removeObsoleteOutEntities();
    this.addNewOutEntitites();
  }
  private removeObsoleteOutEntities() {
    const { missingEntities } = this;
    for (const entity of missingEntities) {
      if (this.getterSections.hasSectionMixed(entity)) {
        const inEntityVarb = this.solverSections.varbByMixed(entity);
        inEntityVarb.removeOutEntity(entity.entityId);
      }
    }
  }
  private addNewOutEntitites() {
    const { newEntities } = this;
    for (const entity of newEntities) {
      if (this.inEntitySectionExists(entity)) {
        const inEntityVarb = this.solverSections.varbByMixed(entity);
        inEntityVarb.addOutEntity(this.newSelfOutEntity);
      }
    }
  }
  private get initialAndNextEntities(): {
    initialEntities: InEntity[];
    nextEntities: InEntity[];
  } {
    return {
      initialEntities: this.initialEntities,
      nextEntities: this.getterVarb.inEntities,
    };
  }
  private get missingEntities(): InEntity[] {
    const { initialEntities, nextEntities } = this.initialAndNextEntities;
    return initialEntities.filter(
      (entity) => !entityS.entitiesHas(nextEntities, entity)
    );
  }
  private get newEntities(): InEntity[] {
    const { initialEntities, nextEntities } = this.initialAndNextEntities;
    return nextEntities.filter(
      (entity) => !entityS.entitiesHas(initialEntities, entity)
    );
  }
  private get newSelfOutEntity(): OutEntity {
    return {
      ...this.getterVarb.feVarbInfoMixed,
      entityId: Id.make(),
    };
  }
  private removeOutEntity(entityId: string): void {
    const nextOutEntities = this.getterVarb.outEntities.filter(
      (outEntity) => outEntity.entityId !== entityId
    );
    this.varbUpdater.update({
      outEntities: nextOutEntities,
    });
  }
  private addOutEntity(outEntity: OutEntity): void {
    const nextOutEntities = [...this.getterVarb.outEntities, outEntity];
    this.varbUpdater.update({
      outEntities: nextOutEntities,
    });
  }
  private inEntitySectionExists(inEntity: InEntity): boolean {
    if (this.getterSections.hasSectionMixed(inEntity)) return true;
    if (this.isUserVarbAndWasDeleted(inEntity)) return false;
    throw varbNotFoundMixed(inEntity);
  }
  private isUserVarbAndWasDeleted(varbInfo: InEntityVarbInfo): boolean {
    const { sectionName } = varbInfo;
    return (
      sectionName === "userVarbItem" &&
      !this.getterSections.hasSectionMixed(varbInfo)
    );
  }
  private solveOutVarbs(): void {
    this.gatherOutVarbInfos();
    this.addVarbInfosToSolveFor(...this.outVarbInfos);
    this.solverSections.solve();
  }
  gatherOutVarbInfos() {
    this.outVarbInfos = [];
    this.gatherOutEntities();
    this.gatherOutRelatives();
  }
  private gatherOutEntities() {
    const { outEntities } = this.getterVarb;
    const feOutEntities = outEntities.map((outEntity) => {
      const varb = this.getterSections.varbByMixed(outEntity);
      return varb.feVarbInfo;
    });
    this.outVarbInfos.push(...feOutEntities);
  }
  private gatherOutRelatives() {
    const { outUpdatePacks } = this.getterVarb.meta;
    for (const outUpdatePack of outUpdatePacks) {
      if (VarbMeta.isSwitchOutPack(outUpdatePack)) {
        this.gatherFromSwitchUpdatePack(outUpdatePack);
      } else {
        this.gatherFromDefaultUpdatePack(outUpdatePack);
      }
    }
  }
  private gatherFromSwitchUpdatePack({
    relTargetVarbInfo,
    switchInfo,
    switchValue,
  }: OutSwitchPack) {
    const targetVarbInfos = this.relativesToFeVarbInfos(relTargetVarbInfo);
    for (const targetInfo of targetVarbInfos) {
      const targetVarb = this.getterVarb.getterVarb(targetInfo);
      if (targetVarb.switchIsActive(switchInfo, switchValue))
        this.outVarbInfos.push(targetInfo);
    }
  }
  private gatherFromDefaultUpdatePack({
    relTargetVarbInfo,
    inverseSwitches,
  }: OutDefaultPack) {
    const targetVarbInfos = this.relativesToFeVarbInfos(relTargetVarbInfo);
    for (const targetInfo of targetVarbInfos) {
      const targetVarb = this.getterVarb.getterVarb(targetInfo);
      let gatherTargetVarb = true;
      for (const { switchInfo, switchValue } of inverseSwitches) {
        if (targetVarb.switchIsActive(switchInfo, switchValue)) {
          gatherTargetVarb = false;
          break;
        }
      }
      // why is that static?
      //
      if (gatherTargetVarb) {
        this.outVarbInfos.push(targetInfo);
      }
    }
  }
  private relativesToFeVarbInfos<SN extends SectionName<"hasVarb">>(
    relVarbInfo: RelVarbInfo<SN>
  ): VarbInfo<SN>[] {
    const varbs = this.getterVarbs.varbsByFocalMixed(relVarbInfo);
    const feVarbInfos = varbs.map((varb) => varb.feVarbInfo);
    return feVarbInfos;
  }
}

// I probably don't need these, because the inEntities are already updated with
// the new value. Only the out entities need to be updated in response.
// private removeInEntity(
//   { entityId, ...inEntityVarbInfo }: InEntityVarbInfo & { entityId: string }
// ): void {
//   const value = this.selfVarb.value("numObj");
//   this.varbUpdater.updateProps({
//     value: value.removeEntity(entityId)
//   })
//   if (this.sections.hasSectionMixed(inEntityVarbInfo)) {
//     const inEntityVarb = this.solverSections.varbByMixed(inEntityVarbInfo);
//     inEntityVarb.removeOutEntity(entityId)
//   }
// }
// private addInEntity(inEntity: InEntity): void {
//   const value = this.selfVarb.value("numObj");
//   this.varbUpdater.updateProps({
//     value: value.addEntity(inEntity)
//   });

//   if (this.inEntitySectionExists(inEntity)) {
//     const inEntityVarb = this.solverSections.varbByMixed(inEntity);
//     inEntityVarb.addOutEntity(this.newSelfOutEntity);
//   }
// }
