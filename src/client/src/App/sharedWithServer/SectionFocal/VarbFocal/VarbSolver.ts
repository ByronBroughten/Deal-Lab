import { SolverSections } from "../../Sections/SolverSections";
import {
  entityS,
  InEntity,
  InEntityVarbInfo,
} from "../../SectionsMeta/baseSections/baseValues/entities";
import { Id } from "../../SectionsMeta/baseSections/id";
import { FeVarbInfo } from "../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { OutEntity } from "../../SectionsState/FeSection/FeVarb/entities";
import { StateValue } from "../../SectionsState/FeSection/FeVarb/feValue";
import { FocalVarbBase } from "./FocalVarbBase";
import { ValueSolver } from "./ValueSolver";

type AddOutEntityProps = {
  targetVarb: InEntityVarbInfo;
  outEntity: OutEntity;
};

export class VarbSolver<
  SN extends SectionName<"hasVarb">
> extends FocalVarbBase<SN> {
  private sections = new SolverSections(this.shared);
  private valueSolver = new ValueSolver(this.constructorProps);
  solveAndUpdateValue() {
    const newValue = this.valueSolver.solveValue();
    this.sections.updateValueDirectly({
      ...this.selfVarb.info,
      value: newValue,
    });
  }
  directUpdateAndSolve(value: StateValue) {
    const varb = this.self.varb(this.varbName);
    const nextVarb = varb.updateValue(value);

    this.updateConnectedEntities(nextVarb.inEntities);
    this.sections.updateValueDirectly({ ...this.selfVarb.info, value });
    // updateValueDirectly is used to make sure that a couple other things happen
  }
  // editorUpdateAndSolve() {} This can't be allowed on the server side, but it may be used here.
  private updateConnectedEntities(nextEntities: InEntity[]) {
    const { missingEntities, newEntities } =
      this.getMissingAndNewEntities(nextEntities);
    const outEntity = {
      ...this.selfVarb.infoMixed,
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
    const currentEntities = this.selfVarb.varb.inEntities;
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
}
