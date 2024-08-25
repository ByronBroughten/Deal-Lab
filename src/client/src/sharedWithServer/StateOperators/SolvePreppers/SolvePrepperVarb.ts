import { GetterVarb } from "../../StateGetters/GetterVarb";
import { InEntityGetterVarb } from "../../StateGetters/InEntityGetterVarb";
import { SectionName } from "../../stateSchemas/SectionName";
import { StateValue } from "../../stateSchemas/StateValue";
import { EntityPrepperVarb } from "../EntityPreppers/EntityPrepperVarb";
import { OutEntityGetterVarb } from "../OutEntityGetters/OutEntityGetterVarb";
import { UpdaterVarb } from "../Updaters/UpdaterVarb";
import { SolvePrepperVarbBase } from "./Bases/SolvePrepperVarbBase";

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
