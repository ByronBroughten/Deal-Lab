import {
  virtualVarbToValueNames,
  VirtualVarbToValues,
} from "../SectionsMeta/baseSectionsDerived/baseVarbNames";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionBase } from "./Bases/GetterSectionBase";
import { GetterSection } from "./GetterSection";

export class GetterVirtualVarb<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  private get values(): VirtualVarbToValues {
    return this.get.values(virtualVarbToValueNames);
  }
  get displayName(): string {
    return this.values.displayName.mainText;
  }
  get displayNameFull(): string {
    return this.displayName;
  }
  get startAdornment(): string {
    return this.values.startAdornment.mainText;
  }
  get endAdornment(): string {
    return this.values.endAdornment.mainText;
  }
  displayVarb(valueVarbName: string = "value"): string {
    const { displayValue } = this.get.varb(valueVarbName);
    return `${this.startAdornment}${displayValue}${this.endAdornment}`;
  }
}
