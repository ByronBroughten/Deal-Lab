import { EditorState } from "draft-js";
import { HasVarbInfoProps } from "../HasInfoProps/HasVarbInfoProps";
import { EditorUpdater } from "../SectionFocal/EditorUpdater";
import {
  entityS,
  InEntity,
  InEntityVarbInfo,
} from "../SectionsMeta/baseSections/baseValues/entities";
import { Id } from "../SectionsMeta/baseSections/id";
import { VarbInfo } from "../SectionsMeta/Info";
import {
  LocalRelVarbInfo,
  RelVarbInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { OutUpdatePack, VarbMeta } from "../SectionsMeta/VarbMeta";
import { FeSectionI } from "../SectionsState/FeSection";
import FeVarb from "../SectionsState/FeSection/FeVarb";
import { OutEntity } from "../SectionsState/FeSection/FeVarb/entities";
import { StateValue } from "../SectionsState/FeSection/FeVarb/feValue";
import { varbNotFoundMixed } from "../SectionsState/FeSection/FeVarbs";
import { FeSections } from "../SectionsState/SectionsState";
import { UpdaterVarb } from "../StateUpdaters/UpdaterVarb";
import { SolverSections, SolverShared } from "./SolverSections";
import { ValueSolver } from "./ValueSolver";

type AddOutEntityProps = {
  targetVarb: InEntityVarbInfo;
  outEntity: OutEntity;
};

// add "SolverShared" to this

interface VarbSolverProps<SN extends SectionName<"hasVarb">>
  extends VarbInfo<SN> {
  shared: SolverShared;
}

export class VarbSolver<
  SN extends SectionName<"hasVarb">
> extends HasVarbInfoProps<SN> {
  readonly shared: SolverShared;
  private valueSolver: ValueSolver<SN>;
  private varbUpdater: UpdaterVarb<SN>;
  private editorUpdater: EditorUpdater<SN>;
  private solverSections: SolverSections;
  private initialVarb: FeVarb<SN>;
  constructor(props: VarbSolverProps<SN>) {
    super(props);
    this.shared = props.shared;
    this.varbUpdater = new UpdaterVarb(this.constructorProps);
    this.valueSolver = new ValueSolver(this.constructorProps);
    this.editorUpdater = new EditorUpdater(this.constructorProps);
    this.solverSections = new SolverSections(this.shared);
    this.initialVarb = this.selfVarb;
  }
  private get sections(): FeSections {
    return this.shared.sections;
  }
  get selfVarb(): FeVarb<SN> {
    return this.sections.varb(this.feVarbInfo);
  }
  get selfSection(): FeSectionI<SN> {
    return this.sections.one(this.feVarbInfo);
  }
  get varbFullNamesToSolveFor(): Set<string> {
    return this.shared.varbFullNamesToSolveFor;
  }
  // well, they both have shared.varbFullNamesToSolveFor
  // I could make something else called varbsToSolveManager.add/get
  // they could each have that.
  // I think that makes sense.

  // how can I share this functionality between VarbSolver and SectionSolver?
  // same with get varbFullNamesToSolveFor

  private get constructorProps() {
    return {
      ...this.feVarbInfo,
      shared: this.shared,
    };
  }
  calculateAndUpdateValue() {
    const newValue = this.valueSolver.solveValue();
    this.varbUpdater.updateValueDirectly(newValue);
  }
  directUpdateAndSolve(value: StateValue) {
    this.varbUpdater.updateValueDirectly(value);
    this.updateConnectedVarbs();
  }
  editorUpdateAndSolve(editorState: EditorState) {
    this.editorUpdater.update(editorState);
    this.updateConnectedVarbs();
  }
  private updateConnectedVarbs() {
    this.updateConnectedEntities();
    this.solveOutVarbs();
    this.initialVarb = this.selfVarb;
  }
  private updateConnectedEntities() {
    this.removeOutEntities();
    this.addOutEntities();
  }
  private removeOutEntities() {
    const { missingEntities } = this;
    for (const entity of missingEntities) {
      if (this.sections.hasSectionMixed(entity)) {
        const inEntityVarb = this.solverSections.varbByMixed(entity);
        inEntityVarb.removeOutEntity(entity.entityId);
      }
    }
  }
  private addOutEntities() {
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
      initialEntities: this.initialVarb.inEntities,
      nextEntities: this.selfVarb.inEntities,
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
      ...this.selfVarb.feMixedInfo,
      entityId: Id.make(),
    };
  }
  private removeOutEntity(entityId: string): void {
    const nextOutEntities = this.selfVarb.outEntities.filter(
      (outEntity) => outEntity.entityId !== entityId
    );
    this.varbUpdater.updateProps({
      outEntities: nextOutEntities,
    });
  }
  private addOutEntity(outEntity: OutEntity): void {
    const nextOutEntities = [...this.selfVarb.outEntities, outEntity];
    this.varbUpdater.updateProps({
      outEntities: nextOutEntities,
    });
  }
  // I don't need this.
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
  private inEntitySectionExists(inEntity: InEntity): boolean {
    if (this.sections.hasSectionMixed(inEntity)) return true;
    if (this.isUserVarbAndWasDeleted(inEntity)) return false;
    throw varbNotFoundMixed(inEntity);
  }
  private isUserVarbAndWasDeleted(varbInfo: InEntityVarbInfo): boolean {
    const { sectionName } = varbInfo;
    return (
      sectionName === "userVarbItem" && !this.sections.hasSectionMixed(varbInfo)
    );
  }
  private solveOutVarbs(): void {
    this.addVarbInfosToSolveFor(...this.outVarbInfos());
    this.solverSections.solve();
  }
  private addVarbInfosToSolveFor(...varbInfos: VarbInfo[]): void {
    // ok. I'll change this to use VarbInfo
    const fullNames = varbInfos.map((info) =>
      FeVarb.feVarbInfoToFullName(info)
    );
    this.shared.varbFullNamesToSolveFor = new Set([
      ...this.varbFullNamesToSolveFor,
      ...fullNames,
    ]);
  }

  outVarbInfos(): VarbInfo[] {
    const { outInfosOfRelatives, feOutEntities } = this;
    return [...feOutEntities, ...outInfosOfRelatives];
  }
  private get feOutEntities(): VarbInfo[] {
    const { outEntities } = this.selfVarb;
    return outEntities.map((outEntity) => {
      const varb = this.sections.varbByMixed(outEntity);
      return varb.info;
    });
  }

  private get outInfosOfRelatives(): VarbInfo[] {
    const { outUpdatePacks } = this.selfVarb;
    return outUpdatePacks.reduce((varbInfos, outUpdatePack) => {
      const { relTargetVarbInfo } = outUpdatePack;
      const targetVarbInfos = this.relativesToFeVarbInfos(relTargetVarbInfo);
      for (const targetVarbInfo of targetVarbInfos) {
        if (this.varbSwitchIsActive(targetVarbInfo, outUpdatePack))
          varbInfos.push(targetVarbInfo);
      }
      return varbInfos;
    }, [] as VarbInfo[]);
  }

  private relativesToFeVarbInfos<SN extends SectionName<"hasVarb">>(
    relVarbInfo: RelVarbInfo<SN>
  ): VarbInfo<SN>[] {
    const varbs = this.sections.varbsByFocal(
      this.selfSection.feInfo,
      relVarbInfo
    );
    const feVarbInfos = varbs.map((varb) => varb.info);
    return feVarbInfos;
  }
  private varbSwitchIsActive(
    switchFocal: VarbInfo,
    outUpdatePack: OutUpdatePack
  ): boolean {
    if (VarbMeta.isSwitchOutPack(outUpdatePack)) {
      const { switchInfo, switchValue } = outUpdatePack;
      return this.switchIsActive(switchFocal, switchInfo, switchValue);
    } else if (VarbMeta.isDefaultOutPack(outUpdatePack)) {
      const { inverseSwitches } = outUpdatePack;
      for (const { switchInfo, switchValue } of inverseSwitches) {
        if (this.switchIsActive(switchFocal, switchInfo, switchValue))
          return false;
      }
      return true;
    } else throw new Error(`Only switch and default outpacks work here.`);
  }
  private switchIsActive(
    focalInfo: VarbInfo,
    relSwitchInfo: LocalRelVarbInfo,
    switchValue: string
  ): boolean {
    // VarbSolver could have varbByFocal

    // The sectionGetter could have a varb like that, too.

    // the varb's sections would become stale, though.
    // I guess they could be shared, as well.

    // no, but they are state.
    // there would need to be a GetterVarb

    // the getterVarb would have all the stuff that FeVarb
    // has now. but it would also have sections

    return (
      switchValue ===
      this.sections.varbByFocal(focalInfo, relSwitchInfo).value("string")
    );
  }
}
