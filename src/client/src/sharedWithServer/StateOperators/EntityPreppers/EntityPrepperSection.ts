import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { FeVarbInfo } from "../../StateGetters/Identifiers/FeInfo";
import { VarbName } from "../../stateSchemas/fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { SectionName } from "../../stateSchemas/schema2SectionNames";
import { EntityPrepperVarb } from "./EntityPrepperVarb";

export class EntityPrepperSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
  private prepperVarb(varbInfo: FeVarbInfo): EntityPrepperVarb {
    return new EntityPrepperVarb({
      ...this.getterSectionsProps,
      ...varbInfo,
    });
  }
  removeOutEntitiesOfAllInEntities(throwArmed: boolean = true) {
    const { selfAndDescendantVarbInfos } = this.get;
    for (const varbInfo of selfAndDescendantVarbInfos) {
      const varb = this.prepperVarb(varbInfo);
      varb.removeAllOutEntitiesOfInEntities(throwArmed);
    }
  }
  removeOutEntitiesOfVarbNameInEntities(
    varbNames: VarbName<SN>[],
    throwArmed: boolean = true
  ) {
    const varbInfos = varbNames.map((varbName) => this.get.varbInfo(varbName));
    for (const varbInfo of varbInfos) {
      const varb = this.prepperVarb(varbInfo);
      varb.removeAllOutEntitiesOfInEntities(throwArmed);
    }
  }
}
