import { numObj, NumObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { GetterVarbNumObj } from "../../StateGetters/GetterVarbNumObj";

export class UserVarbValueSolver extends GetterSectionBase<"userVarbItem"> {
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
