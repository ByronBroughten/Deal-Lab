import { SolverSections } from "../../Sections/SolverSections";
import {
  entityS,
  InEntity,
  InEntityVarbInfo,
} from "../../SectionsMeta/baseSections/baseValues/entities";
import { NumObj } from "../../SectionsMeta/baseSections/baseValues/NumObj";
import { Id } from "../../SectionsMeta/baseSections/id";
import { InfoS, VarbInfo } from "../../SectionsMeta/Info";
import { FeVarbInfo } from "../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ValueTypeName } from "../../SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import FeVarb, {
  ValueTypesPlusAny,
} from "../../SectionsState/FeSection/FeVarb";
import { OutEntity } from "../../SectionsState/FeSection/FeVarb/entities";
import { StateValue } from "../../SectionsState/FeSection/FeVarb/feValue";
import { FocalSectionBase } from "../FocalSectionBase";
import { SelfGettersProps } from "../SelfGetters";

interface FocalVarbProps<SN extends SectionName> extends SelfGettersProps<SN> {
  varbName: string;
}

class FocalVarbBase<
  SN extends SectionName<"hasVarb">
> extends FocalSectionBase<SN> {
  readonly varbName: string;
  constructor({ varbName, ...rest }: FocalVarbProps<SN>) {
    super(rest);
    this.varbName = varbName;
  }
}

// how do I share these getters?
// I can extend self I guess.

// self is, for now, only for the focal section

// I could make it instead be selfSection
// and then this could have selfVarb
// that would be the easiest way to make FocalVarb borrow from FocalSection

//

class VarbSolver<SN extends SectionName<"hasVarb">> extends FocalVarbBase<SN> {
  private sections = new SolverSections(this.shared);
  private get selfVarb(): FeVarb {
    return this.self.varb(this.varbName);
  }
  private get varbInfo(): VarbInfo<SN> {
    return {
      ...this.self.feInfo,
      varbName: this.varbName,
    };
  }
  private get varbInfoMixed(): FeVarbInfo<SN> {
    return InfoS.feToMixedVarb(this.varbInfo);
  }
  private value<VT extends ValueTypeName>(
    valueType?: VT
  ): ValueTypesPlusAny[VT] {
    return this.selfVarb.value(valueType);
  }
  private localValue<VT extends ValueTypeName>(
    varbName: string,
    valueType?: VT
  ): ValueTypesPlusAny[VT] {
    return this.sections
      .varb({ ...this.self.feInfo, varbName })
      .value(valueType);
  }

  solveAndUpdateValue() {
    const newValue = this.valueSolver.solveValue();
    this.sections.updateValueDirectly({ ...this.varbInfo, value: newValue });
  }

  directUpdateAndSolve(value: StateValue) {
    const varb = this.self.varb(this.varbName);
    const nextVarb = varb.updateValue(value);

    this.updateConnectedEntities(nextVarb.inEntities);
    this.sections.updateValueDirectly({ ...this.varbInfo, value });
    // updateValueDirectly is used to make sure that a couple other things happen
  }
  private updateConnectedEntities(nextEntities: InEntity[]) {
    const { missingEntities, newEntities } =
      this.getMissingAndNewEntities(nextEntities);
    const outEntity = {
      ...this.varbInfoMixed,
      entityId: Id.make(),
    };
    for (const entity of missingEntities) {
      if (this.sections.hasSectionMixed(entity)) {
        this.removeInEntity(outEntity, entity);
      }
    }
    for (const entity of newEntities) {
      this.addInEntity(outEntity, entity);
    }
  }
  private getMissingAndNewEntities(nextEntities: InEntity[]): {
    missingEntities: InEntity[];
    newEntities: InEntity[];
  } {
    const currentEntities = this.selfVarb.inEntities;
    const missingEntities = currentEntities.filter(
      (entity) => !entityS.entitiesHas(nextEntities, entity)
    );
    const newEntities = nextEntities.filter(
      (entity) => !entityS.entitiesHas(currentEntities, entity)
    );
    return { missingEntities, newEntities };
  }

  private removeInEntity(
    feVarbInfo: FeVarbInfo,
    { entityId, ...inEntityVarbInfo }: InEntityVarbInfo & { entityId: string }
  ): void {
    const nextVarb = this.sections
      .varbByMixed(feVarbInfo)
      .removeInEntity(entityId);
    this.sections.updateVarb(nextVarb);
    this.removeOutEntity(inEntityVarbInfo, { ...feVarbInfo, entityId });
  }
  private removeOutEntity(
    varbInfo: InEntityVarbInfo,
    outEntity: OutEntity
  ): void {
    if (this.sections.hasSectionMixed(varbInfo)) {
      const varb = this.sections.varbByMixed(varbInfo);
      this.sections.updateVarb(varb.removeOutEntity(outEntity));
    }
  }
  private addInEntity(feVarbInfo: FeVarbInfo, inEntity: InEntity) {
    const varb = this.sections.varbByMixed(feVarbInfo);
    this.sections.updateVarb(varb.addInEntity(inEntity));

    this.addOutEntity({
      targetVarb: inEntity,
      outEntity: {
        ...feVarbInfo,
        entityId: inEntity.entityId,
      },
    });
  }
  private addOutEntity({ targetVarb, outEntity }: AddOutEntityProps) {
    if (this.isUserVarbAndWasDeleted(targetVarb)) return;
    const varb = this.sections.varbByMixed(targetVarb);
    this.sections.updateVarb(varb.addOutEntity(outEntity));
  }
  private isUserVarbAndWasDeleted(varbInfo: InEntityVarbInfo): boolean {
    const { sectionName } = varbInfo;
    return (
      sectionName === "userVarbItem" && !this.sections.hasSectionMixed(varbInfo)
    );
  }
  solveValue(): NumObj | string | undefined {
    function isInUpdateFns(str: string): str is keyof typeof updateFns {
      return str in updateFns;
    }

    const updateFnName = analyzer.updateFnName(feVarbInfo);
    if (isCalculationName(updateFnName)) return updateFns.calculation();
    if (isInUpdateFns(updateFnName)) return updateFns[updateFnName]();
    else return undefined;
  }
  solvableTextFromCalcVarbs(): string {
    const { updateFnName } = this.inUpdatePack();
    if (updateFnName !== "calcVarbs")
      throw new Error("This is only for calcVarbs");

    const { core } = this.value("numObj");
    return this.solvableTextFromEditorTextAndEntities(core);
  }

  private inUpdatePack(): InUpdatePack {
    // do I get the inSwitchUpdateFnProps, too?
    // I guess so. I think this is the place to do it.
    const varb = this.selfVarb;
    const {
      inSwitchUpdatePacks,
      defaultUpdateFnName,
      defaultInUpdateFnInfos,
      defaultUpdateFnProps,
    } = varb.meta;
    for (const pack of inSwitchUpdatePacks) {
      const {
        switchInfo,
        switchValue,
        updateFnName,
        inUpdateInfos,
        updateFnProps,
      } = pack;
      if (this.switchIsActive(switchInfo, switchValue))
        return { updateFnName, updateFnProps, inUpdateInfos: inUpdateInfos };
    }
    return {
      updateFnName: defaultUpdateFnName,
      updateFnProps: defaultUpdateFnProps,
      inUpdateInfos: defaultInUpdateFnInfos,
    };
  }
  private switchIsActive(
    relSwitchInfo: LocalRelVarbInfo,
    switchValue: string
  ): boolean {
    return (
      switchValue ===
      this.sections
        .varbByFocal(this.varbInfoMixed, relSwitchInfo)
        .value("string")
    );
  }
  private solvableTextFromEditorTextAndEntities({
    editorText,
    entities,
  }: DbNumObj): string {
    // how can I split this up?

    let solvableText = editorText;
    for (const entity of entities) {
      const num = this.getSolvableNumber(entity);
      solvableText = replaceRange(
        solvableText,
        entity.offset,
        entity.offset + entity.length,
        `${num}`
      );
    }
    return solvableText;
  }
}
