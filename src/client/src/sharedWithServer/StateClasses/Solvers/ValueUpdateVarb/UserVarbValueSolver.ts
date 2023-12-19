import { GetterSectionBase } from "../../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../../StateGetters/GetterSection";
import { GetterVarbNumObj } from "../../../StateGetters/GetterVarbNumObj";
import { NumObj, numObj } from "../../../sectionVarbsConfig/StateValue/NumObj";

export class UserVarbValueSolver extends GetterSectionBase<"numVarbItem"> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  solveValue(): NumObj {
    const varbType = this.get.valueNext("valueSourceName") as
      | "valueEditor"
      | "ifThen";

    if (varbType === "valueEditor") {
      const varb = this.get.varb("valueEditor");
      const numObjVarb = new GetterVarbNumObj(varb.getterVarbProps);
      const solvableText = numObjVarb.solvableTextFromTextAndEntities(
        numObjVarb.value
      );
      return numObj(solvableText);
    } else if (varbType === "ifThen") {
      return this.get.onlyChild("conditionalRowList").valueNext("value");
    } else throw new Error(`varbType ${varbType} is invalid.`);
  }
}
//
