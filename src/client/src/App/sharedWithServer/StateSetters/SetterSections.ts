import { VariableOption } from "../Analyzer/methods/get/variableOptions";
import { StateValue } from "../Analyzer/StateSection/StateVarb/stateValue";
import { isStateValue } from "../FeSections/FeSection/FeVarb/feValue";
import { VarbInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { VariableGetterSections } from "../StateEntityGetters/VariableGetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { SetterSectionsBase } from "./SetterBases/SetterSectionsBase";
import { SetterVarb } from "./SetterVarb";

type ValidTarget = {
  name: string;
  value: StateValue;
};

export class SetterSections extends SetterSectionsBase {
  get variableSections() {
    return new VariableGetterSections(
      this.getterSectionsBase.getterSectionsProps
    );
  }
  isValidTarget(target: any): target is ValidTarget {
    return isStateValue(target.value) && typeof target.name === "string";
  }
  validateTarget(target: any): target is ValidTarget {
    if (!isStateValue(target.value)) {
      throw new Error(`target value "${target.value}" is not a stateValue`);
    }
    if (!(typeof target.name === "string")) {
      throw new Error(`target name "${target.name}" is not a string`);
    }
    return true;
  }
  handleChange({ currentTarget }: { currentTarget: any }) {
    if (this.validateTarget(currentTarget)) {
      const { name, value } = currentTarget;
      const feVarbInfo = GetterVarb.varbIdToVarbInfo(name);
      const varb = this.setterVarb(feVarbInfo);
      varb.updateValueDirectly(value);
      this.setSections();
    }
  }
  variableOptions(): VariableOption[] {
    return this.variableSections.variableOptions();
  }
  setterVarb<SN extends SectionName>(varbInfo: VarbInfo<SN>): SetterVarb<SN> {
    return new SetterVarb({
      ...this.setterSectionsProps,
      ...varbInfo,
    });
  }
}
