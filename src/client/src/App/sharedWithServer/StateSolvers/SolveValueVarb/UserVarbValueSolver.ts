import { NumObj } from "../../SectionsMeta/baseSectionsUtils/baseValues/NumObj";
import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";

export class UserVarbValueSolver extends GetterSectionBase<"userVarbItem"> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  solveValue(): NumObj {
    const varbType = this.get.value("valueSwitch", "string") as
      | "labeledEquation"
      | "ifThen";

    if (varbType === "labeledEquation") {
      return this.get.value("numObjEditor", "numObj");
    } else if (varbType === "ifThen") {
      return this.get.onlyChild("conditionalRowList").valueNext("value");
    } else throw new Error(`varbType ${varbType} is invalid.`);
  }
}
//
