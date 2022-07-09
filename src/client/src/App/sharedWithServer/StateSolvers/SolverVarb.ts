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
import { SolverSection } from "./SolverSection";
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
  private get = new GetterVarb(this.getterVarbBase.getterVarbProps);
  constructor(props: SolverVarbProps<SN>) {
    super(props);
    this.initialEntities = [...this.get.inEntities];
  }
  outVarbGetter = new OutVarbGetterVarb(this.getterVarbBase.getterVarbProps);
  private getterSections = new GetterSections(
    this.getterSectionsBase.getterSectionsProps
  );
  private updaterVarb = new UpdaterVarb(this.getterVarbBase.getterVarbProps);
  private valueSolver = new SolveValueVarb(this.getterVarbBase.getterVarbProps);

  private solverSections = new SolverSections(this.solverSectionsProps);
  private get solverSection(): SolverSection<SN> {
    return new SolverSection(this.solverVarbProps);
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
  } // I definitely need editorUpdateAndSolve
  calculateAndUpdateValue() {
    const newValue = this.valueSolver.solveValue();
    this.updaterVarb.updateValueDirectly(newValue);
  }
  directUpdateAndSolve(value: StateValue): void {
    this.updaterVarb.updateValueDirectly(value);
    this.addVarbIdsToSolveFor(this.get.varbId);
    this.updateConnectedVarbs();
  }

  loadValueFromVarb(nextVarbInfo: InEntityVarbInfo) {
    const entityId = this.get.section.value("entityId", "string");
    const varbInfoValue = this.get.section.varbInfoValue();
    this.removeInEntity({ ...varbInfoValue, entityId });

    const nextEntityId = Id.make();
    this.addInEntity({
      entityId: nextEntityId,
      ...nextVarbInfo,
      length: 0, // length and offset are arbitrary
      offset: 0, // just borrowing functionality from editor entities
    });
    this.solverSection.updateValuesAndSolve({
      varbInfo: nextVarbInfo,
      entityId: nextEntityId,
    });
  }

  updateConnectedVarbs(): void {
    this.updateConnectedEntities();
    this.solveOutVarbs();
    this.initialEntities = [...this.get.inEntities];
  }
  private updateConnectedEntities() {
    this.removeObsoleteOutEntities();
    this.addNewOutEntitites();
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
    ...inEntityVarbInfo
  }: InEntityVarbInfo & { entityId: string }): void {
    this.updaterVarb.update({
      value: this.get.numObj.removeEntity(entityId),
    });
    if (this.getterSections.hasSectionMixed(inEntityVarbInfo)) {
      const inEntityVarb = this.solverSections.varbByMixed(inEntityVarbInfo);
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
