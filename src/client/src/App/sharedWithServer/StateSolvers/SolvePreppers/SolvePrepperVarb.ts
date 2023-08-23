import { SectionName } from "../../SectionsMeta/SectionName";
import { StateValue } from "../../SectionsMeta/values/StateValue";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { InEntityGetterVarb } from "../../StateGetters/InEntityGetterVarb";
import { OutEntityGetterVarb } from "../../StateInOutVarbs/OutEntityGetterVarb";
import { UpdaterVarb } from "../../StateUpdaters/UpdaterVarb";
import { EntityPrepperVarb } from "../EntityPreppers/EntityPrepperVarb";
import { SolvePrepperVarbBase } from "./SolvePrepperBases/SolvePrepperVarbBase";

export class SolvePrepperVarb<
  SN extends SectionName = SectionName
> extends SolvePrepperVarbBase<SN> {
  get get() {
    return new GetterVarb(this.getterVarbProps);
  }
  get inEntity() {
    return new InEntityGetterVarb(this.getterVarbBase.getterVarbProps);
  }
  get outEntity() {
    return new OutEntityGetterVarb(this.getterVarbBase.getterVarbProps);
  }
  get entity(): EntityPrepperVarb<SN> {
    return new EntityPrepperVarb(this.getterVarbProps);
  }
  get updaterVarb(): UpdaterVarb<SN> {
    return new UpdaterVarb(this.getterVarbProps);
  }
  directUpdate(nextValue: StateValue): void {
    this.updaterVarb.updateValue(nextValue);
    this.addVarbIdsToSolveFor(this.get.varbId);
    this.prepOutEntitySolve();
  }
  editorUpdate(nextValue: StateValue): void {
    this.updaterVarb.updateValue(nextValue);
    this.prepOutEntitySolve();
  }
  private prepOutEntitySolve(): void {
    this.doNotThrowIfEntityToRemoveMissing();
    this.entity.updateConnectedEntities();
    this.addVarbInfosToSolveFor(...this.outEntity.activeOutEntities);
  }
}
