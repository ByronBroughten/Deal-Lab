import { FeVarbInfoMixed } from "../SectionsMeta/baseSectionsDerived/baseVarbInfo";
import {
  entityS,
  InEntity,
  InEntityVarbInfo,
  OutEntity,
  OutEntityInfo,
} from "../SectionsMeta/baseSectionsVarbs/baseValues/entities";
import { StateValue } from "../SectionsMeta/baseSectionsVarbs/baseValues/StateValueTypes";
import { Id } from "../SectionsMeta/baseSectionsVarbs/id";
import { RelInVarbInfo } from "../SectionsMeta/sectionChildrenDerived/RelInOutVarbInfo";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { OutVarbGetterVarb } from "../StateInOutVarbs/OutVarbGetterVarb";
import { UpdaterVarb } from "../StateUpdaters/UpdaterVarb";
import { StrictOmit } from "../utils/types";
import { PackBuilderSections } from "./../StatePackers.ts/PackBuilderSections";
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
  private get solverSections() {
    return new SolverSections(this.solverSectionsProps);
  }
  get builderSections() {
    return new PackBuilderSections(this.getterSectionProps);
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
    this.updateValue(newValue);
    this.solveOutVarbs();
  }
  private updateValue(newValue: StateValue): void {
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
    // the utility list is being removed and then reloaded with
    // the user's. But for some reason, propertyGeneral doesn't
    // have the outEntity of the utilty list
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
  private addOutEntitiesFromInEntities(inEntities: InEntity[]): void {
    for (const entity of inEntities) {
      if (this.inEntitySectionExists(entity)) {
        const inEntityVarb = this.getInEntityVarb(entity);
        const outEntity = this.newSelfOutEntity(entity.entityId);
        if (!inEntityVarb.hasOutEntity(outEntity)) {
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
  hasInEntityVarb(inEntity: InEntityVarbInfo) {
    return this.getterSections.hasSectionMixed(inEntity);
  }
  getInEntityVarb(inEntity: InEntity): SolverVarb {
    return this.solverSections.varbByMixed(inEntity);
  }
  private removeOutEntitiesOfInEntities(inEntities: InEntity[]) {
    for (const inEntity of inEntities) {
      if (this.hasInEntityVarb(inEntity)) {
        const inEntityVarb = this.getInEntityVarb(inEntity);
        inEntityVarb.removeOutEntity({
          entityId: inEntity.entityId,
          feId: this.get.feId,
        });
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
      (entity) => !entityS.inEntitiesHas(nextEntities, entity)
    );
  }
  private get newEntities(): InEntity[] {
    const { initialEntities, nextEntities } = this.initialAndNextEntities;
    return nextEntities.filter(
      (entity) => !entityS.inEntitiesHas(initialEntities, entity)
    );
  }
  private hasOutEntity(info: OutEntityInfo): boolean {
    const { outEntities } = this.get;
    return entityS.outEntitiesHas(outEntities, info);
  }
  private removeOutEntity(info: OutEntityInfo): void {
    if (!this.hasOutEntity(info)) {
      throw new Error("Tried to remove entity, but entity not found.");
    }
    const { outEntities } = this.get;
    const nextOutEntities = entityS.outEntitiesCopyRm(outEntities, info);
    this.updaterVarb.update({
      outEntities: nextOutEntities,
    });
  }
  private addOutEntity(outEntity: OutEntity): void {
    const nextOutEntities = [...this.get.outEntities, outEntity];
    this.updaterVarb.update({ outEntities: nextOutEntities });
  }
  private inEntitySectionExists(inEntity: InEntity): boolean {
    if (this.hasInEntityVarb(inEntity)) return true;
    if (this.isUserVarbAndWasDeleted(inEntity)) return false;
    throw varbNotFoundMixed(inEntity);
  }
  private isUserVarbAndWasDeleted(varbInfo: InEntityVarbInfo): boolean {
    const { sectionName } = varbInfo;
    return sectionName === "userVarbItem" && !this.hasInEntityVarb(varbInfo);
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
}: {
  varbName: string;
  sectionName: string;
  infoType: string;
}) {
  return new Error(
    `There is no varb at ${sectionName}.${varbName} with infoType ${infoType}.`
  );
}

export type InVarbInfo = InEntity | FeVarbInfoMixed;
