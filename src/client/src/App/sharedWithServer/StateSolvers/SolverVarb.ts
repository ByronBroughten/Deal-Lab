import {
  entityS,
  InEntity,
  InEntityVarbInfo,
  InVarbInfo,
  OutEntity,
} from "../SectionsMeta/baseSectionsUtils/baseValues/entities";
import { StateValue } from "../SectionsMeta/baseSectionsUtils/baseValues/StateValueTypes";
import { Id } from "../SectionsMeta/baseSectionsUtils/id";
import { VarbInfoMixed } from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { RelInVarbInfo } from "../SectionsMeta/childSectionsDerived/RelInOutVarbInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { OutVarbGetterVarb } from "../StateInOutVarbs/OutVarbGetterVarb";
import { UpdaterVarb } from "../StateUpdaters/UpdaterVarb";
import { StrictOmit } from "../utils/types";
import { SolverVarbBase, SolverVarbProps } from "./SolverBases/SolverVarbBase";
import { SolverSections } from "./SolverSections";
import { SolveValueVarb } from "./SolveValueVarb";

type InitSolverVarbProps<SN extends SectionName> = StrictOmit<
  SolverVarbProps<SN>,
  "solveShare"
>;

export class SolverVarb<
  SN extends SectionName<"hasVarb"> = SectionName<"hasVarb">
> extends SolverVarbBase<SN> {
  private initialEntities: InEntity[];
  constructor(props: SolverVarbProps<SN>) {
    super(props);
    this.initialEntities = [...this.get.inEntities];
  }
  get get() {
    return new GetterVarb(this.getterVarbBase.getterVarbProps);
  }
  get outVarbGetter() {
    return new OutVarbGetterVarb(this.getterVarbBase.getterVarbProps);
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
  private solverSections = new SolverSections(this.solverSectionsProps);

  localSolverVarb(varbName: string): SolverVarb<SN> {
    return new SolverVarb({
      ...this.solverSectionProps,
      varbName,
    });
  }

  static init<SN extends SectionName>(
    props: InitSolverVarbProps<SN>
  ): SolverVarb<SN> {
    return new SolverVarb({
      ...props,
      solveShare: {
        varbIdsToSolveFor: new Set(),
      },
    });
  }
  calculateAndUpdateValue() {
    const newValue = this.valueSolver.solveValue();
    this.updateValueDirectly(newValue);
  }
  directUpdateAndSolve(value: StateValue): void {
    this.updateValueDirectly(value);
    this.addVarbIdsToSolveFor(this.get.varbId);
    this.solveOutVarbs();
  }
  editorUpdateAndSolve(newValue: StateValue): void {
    // solving the varb that was updated messes with the editor cursor
    // due to manualUpdateEditorToggle, so best to only solve connected varbs
    this.updateValueByEditor(newValue);
    this.solveOutVarbs();
  }
  private updateValueDirectly(newValue: StateValue): void {
    this.updaterVarb.updateValueDirectly(newValue);
    this.updateConnectedEntities();
  }
  private updateValueByEditor(newValue: StateValue): void {
    this.updaterVarb.updateValueByEditor(newValue);
    this.updateConnectedEntities();
  }

  // The way to handle this:
  // Make the other varb updates depend on the varbInfo updating.
  // updateValueDirectly(varbInfo)
  // the rest should take care of itself.

  // I don't think I need to unload the previous varb
  // the other varbs should have their entities removed.

  // ok, the tricky part is getting rid of the previous entity

  // 1. Get rid of whichever entity is at 0, 0.
  //    Assumes there is only one unseen entity

  // 4. Add a property to entity, called "entitySource", which is
  //    a string. entitySource may just say "editor", or the varbId of a loaded
  //    varb

  // 5. Make the entityId of those entities be a varbId.
  //    The entityId is just a way of differentiating entities.

  //    The entityId differentiates between entities
  //    using a varbId as an entityId comes with two costs:
  //  1. there are two different types of string that may be an entityId
  //  2. entityId then serves to differentiate between entities
  //     as well as to locate the varb from where the entity came.

  loadValueFromVarb(varbInfo: InEntityVarbInfo) {
    const entityInfo = { ...varbInfo, entityId: Id.make() };
    const infoVarb = this.localSolverVarb("valueEntityInfo");

    infoVarb.updaterVarb.updateValueByEditor(entityInfo);

    this.updateConnectedEntities();
    this.solveOutVarbs();

    this.addInEntity({
      ...entityInfo,
      entitySource: infoVarb.get.varbId,
      length: 0, // length and offset are arbitrary
      offset: 0, // just borrowing functionality from editor entities
    });
  }

  updateConnectedVarbs(): void {
    this.updateConnectedEntities();
    this.solveOutVarbs();
  }
  private updateConnectedEntities() {
    this.removeObsoleteOutEntities();
    this.addNewOutEntitites();
    this.initialEntities = [...this.get.inEntities];
  }
  addOutEntitiesOfInEntities() {
    const { inEntities } = this.get;
    for (const inEntity of inEntities) {
      if (this.getterSections.hasSectionMixed(inEntity)) {
        const inEntityVarb = this.solverSections.varbByMixed(inEntity);
        inEntityVarb.addOutEntity({
          ...this.get.feVarbInfoMixed,
          entityId: inEntity.entityId,
        });
      }
    }
  }
  removeOutEntitiesOfInEntities() {
    const { inEntities } = this.get;
    for (const inEntity of inEntities) {
      if (this.getterSections.hasSectionMixed(inEntity)) {
        const inEntityVarb = this.solverSections.varbByMixed(inEntity);
        inEntityVarb.removeOutEntity(inEntity.entityId);
      }
    }
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
      nextEntities: this.get.inEntities,
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
      ...this.get.feVarbInfoMixed,
      entityId: Id.make(),
    };
  }
  private removeOutEntity(entityId: string): void {
    const nextOutEntities = this.get.outEntities.filter(
      (outEntity) => outEntity.entityId !== entityId
    );
    this.updaterVarb.update({
      outEntities: nextOutEntities,
    });
  }
  private addOutEntity(outEntity: OutEntity): void {
    const nextOutEntities = [...this.get.outEntities, outEntity];
    this.updaterVarb.update({
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
    this.addVarbInfosToSolveFor(...this.outVarbGetter.outVarbInfos);
    this.solverSections.solve();
  }
  get hasInVarbs(): boolean {
    return this.inVarbInfos.length > 0;
  }
  get inVarbInfos(): InVarbInfo[] {
    const relativeInfos = this.inRelToFeMixedInfos();
    const { inEntities } = this.get;
    return [...relativeInfos, ...inEntities];
  }
  private inRelToFeMixedInfos(): InVarbInfo[] {
    return this.inRelativeInfos.reduce((inFeInfos, inRelInfo) => {
      const varbs = this.get.varbsByFocalMixed(inRelInfo);
      return inFeInfos.concat(varbs.map((varb) => varb.feVarbInfoMixed));
    }, [] as InVarbInfo[]);
  }
  private get inRelativeInfos(): RelInVarbInfo[] {
    return this.get.inUpdatePack.inUpdateInfos;
  }

  private removeInEntity({
    entityId,
    ...inEntityInfoValue
  }: InEntityVarbInfo & { entityId: string }): void {
    this.updaterVarb.update({
      value: this.get.numObj.removeEntity(entityId),
    });
    if (this.getterSections.hasSectionMixed(inEntityInfoValue)) {
      const inEntityVarb = this.solverSections.varbByMixed(inEntityInfoValue);
      inEntityVarb.removeOutEntity(entityId);
    }
  }
  private addInEntity(inEntity: InEntity): void {
    this.updaterVarb.update({
      value: this.get.numObj.addEntity(inEntity),
    });
    if (this.inEntitySectionExists(inEntity)) {
      const inEntityVarb = this.solverSections.varbByMixed(inEntity);
      inEntityVarb.addOutEntity(this.newSelfOutEntity);
    }
  }
}

export function varbNotFoundMixed({
  varbName,
  sectionName,
  infoType,
}: VarbInfoMixed) {
  return new Error(
    `There is no varb at ${sectionName}.${varbName} with infoType ${infoType}.`
  );
}
