import { DbSectionInfo } from "../SectionsMeta/allBaseSectionVarbs/DbSectionInfo";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { isStateValue } from "../SectionsMeta/values/valueMetas";
import {
  VariableGetterSections,
  VariableOption,
} from "../StateEntityGetters/VariableGetterSections";
import { GetterList } from "../StateGetters/GetterList";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { SolverSections } from "../StateSolvers/SolverSections";
import { SetterSectionsBase } from "./SetterBases/SetterSectionsBase";
import { SetterSection } from "./SetterSection";
import { SetterVarb } from "./SetterVarb";

type ValidTarget = {
  name: string;
  value: StateValue;
};

export class SetterSections extends SetterSectionsBase {
  get get(): GetterSections {
    return new GetterSections(this.setterSectionsProps);
  }
  getterList<SN extends SectionName>(sectionName: SN): GetterList<SN> {
    return new GetterList({
      ...this.getterSectionsBase,
      sectionName,
    });
  }
  get solverSections(): SolverSections {
    return new SolverSections(this.solverSectionsBase.solverSectionsProps);
  }
  section<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): SetterSection<SN> {
    return new SetterSection({
      ...this.setterSectionsProps,
      ...feInfo,
    });
  }
  applyVariablesToDealPages(): void {
    this.solverSections.applyVariablesToDealPages();
    this.setSections();
  }
  applyVariablesToDealPage(feId: string): void {
    this.solverSections.applyVariablesToDealPage(feId);
    this.setSections();
  }
  sectionByDbInfo<SN extends SectionName>(
    dbInfo: DbSectionInfo<SN>
  ): SetterSection<SN> {
    return this.section(this.get.sectionByDbInfo(dbInfo).feInfo);
  }
  varb<SN extends SectionName>(varbInfo: FeVarbInfo<SN>): SetterVarb<SN> {
    return new SetterVarb({
      ...this.setterSectionsProps,
      ...varbInfo,
    });
  }
  oneAndOnly<SN extends SectionName>(sectionName: SN): SetterSection<SN> {
    return this.section(this.get.oneAndOnly(sectionName));
  }
  get main(): SetterSection<"main"> {
    return this.section(this.get.main.feInfo);
  }
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
  updateVarbCurrentTarget({ currentTarget }: { currentTarget: any }) {
    if (this.validateTarget(currentTarget)) {
      const { name, value } = currentTarget;
      const feVarbInfo = GetterVarb.varbIdToVarbInfo(name);
      const varb = this.varb(feVarbInfo);
      varb.updateValue(value);
    }
  }
  variableOptions(): VariableOption[] {
    return this.variableSections.variableOptions();
  }
}
