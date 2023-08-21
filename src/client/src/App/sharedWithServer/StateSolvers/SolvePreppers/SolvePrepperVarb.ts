import { SectionName } from "../../SectionsMeta/SectionName";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { InEntityGetterVarb } from "../../StateGetters/InEntityGetterVarb";
import { OutEntityGetterVarb } from "../../StateInOutVarbs/OutEntityGetterVarb";
import { UpdaterVarb } from "../../StateUpdaters/UpdaterVarb";
import { SolvePrepperVarbBase } from "./SolvePrepperBases/SolvePrepperVarbBase";

export class SolvePrepperVarb<
  SN extends SectionName = SectionName
> extends SolvePrepperVarbBase<SN> {
  get get() {
    return new GetterVarb(this.getterVarbProps);
  }
  // get getterSection() {
  //   return new GetterSection(this.getterSectionProps);
  // }
  get inEntity() {
    return new InEntityGetterVarb(this.getterVarbBase.getterVarbProps);
  }
  get outEntity() {
    return new OutEntityGetterVarb(this.getterVarbBase.getterVarbProps);
  }
  get updaterVarb(): UpdaterVarb<SN> {
    return new UpdaterVarb(this.getterVarbProps);
  }
}
