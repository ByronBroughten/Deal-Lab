import {
  entityS,
  InEntity,
  InEntityVarbInfo,
  InVarbInfo,
  OutEntity,
} from "../SectionsMeta/baseSectionsVarbs/baseValues/entities";
import { StateValue } from "../SectionsMeta/baseSectionsVarbs/baseValues/StateValueTypes";
import { Id } from "../SectionsMeta/baseSectionsVarbs/id";
import { VarbInfoMixed } from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { RelInVarbInfo } from "../SectionsMeta/childSectionsDerived/RelInOutVarbInfo";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { OutVarbGetterVarb } from "../StateInOutVarbs/OutVarbGetterVarb";
import { UpdaterVarb } from "../StateUpdaters/UpdaterVarb";
import { StrictOmit } from "../utils/types";
import { SolverVarbBase, SolverVarbProps } from "./SolverBases/SolverVarbBase";
import { SolverSections } from "./SolverSections";
import { SolveValueVarb } from "./SolveValueVarb";

type InitSolverVarbProps<SN extends SectionNameByType> = StrictOmit<
  SolverVarbProps<SN>,
  "solveShare"
>;

export class SolverVarb<
  SN extends SectionNameByType<"hasVarb"> = SectionNameByType<"hasVarb">
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

  static init<SN extends SectionNameByType>(
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
    this.updateValue(newValue);
  }
  directUpdateAndSolve(value: StateValue): void {
    this.updateValue(value);
    this.addVarbIdsToSolveFor(this.get.varbId);
    this.solveOutVarbs();
  }
  editorUpdateAndSolve(newValue: StateValue): void {
    // can probably be replaced by directUpdateAndSolve
    this.updateValueByEditor(newValue);
    this.solveOutVarbs();
  }
  private updateValue(newValue: StateValue): void {
    this.updaterVarb.updateValue(newValue);
    this.updateConnectedEntities();
  }
  private updateValueByEditor(newValue: StateValue): void {
    this.updaterVarb.updateValue(newValue);
    this.updateConnectedEntities();
  }

  loadValueFromVarb(varbInfo: InEntityVarbInfo) {
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
  addOutEntitiesFromCurrentInEntities() {
    const { inEntities } = this.get;
    this.addOutEntitiesFromInEntities(inEntities);
  }
  removeOutEntitiesOfCurrentInEntities() {
    const { inEntities } = this.get;
    this.removeOutEntitiesOfInEntities(inEntities);
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
  private addNewOutEntitites() {
    const { newEntities } = this;
    this.addOutEntitiesFromInEntities(newEntities);
  }
  private addOutEntitiesFromInEntities(inEntities: InEntity[]) {
    this.dummyCheck(inEntities);
    for (const entity of inEntities) {
      if (this.inEntitySectionExists(entity)) {
        const inEntityVarb = this.solverSections.varbByMixed(entity);
        inEntityVarb.addOutEntity(this.newSelfOutEntity(entity.entityId));
      }
    }
  }
  private dummyCheck(inEntities: InEntity[]) {
    if (
      inEntities.length > 1 &&
      inEntities.every((entity) => {
        return (
          entity.sectionName === "deal" && entity.varbName === "totalInvestment"
        );
      })
    ) {
      throw new Error("There shouldn't be two of these.");
    }
  }
  private newSelfOutEntity(inEntityId: string): OutEntity {
    return {
      ...this.get.feVarbInfoMixed,
      entityId: inEntityId,
    };
  }
  private removeOutEntitiesOfInEntities(inEntities: InEntity[]) {
    for (const inEntity of inEntities) {
      if (this.getterSections.hasSectionMixed(inEntity)) {
        const inEntityVarb = this.solverSections.varbByMixed(inEntity);
        inEntityVarb.removeOutEntity(inEntity.entityId);
      }
    }
  }
  private removeObsoleteOutEntities() {
    const { missingEntities } = this;
    this.removeOutEntitiesOfInEntities(missingEntities);
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
  private removeOutEntity(entityId: string): void {
    const entity = this.get.outEntities.find(
      (entity) => entity.entityId === entityId
    );
    if (!entity) {
      throw new Error("Tried to remove entity, but entity not found.");
    }
    const nextOutEntities = this.get.outEntities.filter(
      (outEntity) => outEntity.entityId !== entityId
    );
    this.updaterVarb.update({
      outEntities: nextOutEntities,
    });
  }
  private addOutEntity(outEntity: OutEntity): void {
    const nextOutEntities = [...this.get.outEntities, outEntity];
    this.updaterVarb.update({ outEntities: nextOutEntities });
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
  private addInEntity(inEntity: InEntity): void {
    this.updaterVarb.update({
      value: this.get.numObj.addEntity(inEntity),
    });
    this.addOutEntitiesFromInEntities([inEntity]);
  }
  private removeInEntity(inEntity: InEntity): void {
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
}: VarbInfoMixed) {
  return new Error(
    `There is no varb at ${sectionName}.${varbName} with infoType ${infoType}.`
  );
}
