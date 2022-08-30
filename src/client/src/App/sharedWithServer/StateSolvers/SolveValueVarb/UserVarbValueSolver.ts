import {
  numObj,
  NumObj,
} from "../../SectionsMeta/baseSectionsUtils/baseValues/NumObj";
import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { GetterVarbNumObj } from "../../StateGetters/GetterVarbNumObj";

export class UserVarbValueSolver extends GetterSectionBase<"userVarbItem"> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  solveValue(): NumObj {
    const varbType = this.get.value("valueSwitch", "string") as
      | "labeledEquation"
      | "ifThen";

    if (varbType === "labeledEquation") {
      const varb = this.get.varb("numObjEditor");
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
