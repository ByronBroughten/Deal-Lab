import {
  virtualVarbToValueNames,
  VirtualVarbToValues,
} from "../SectionsMeta/baseSectionsDerived/baseVarbNames";
import { SimpleSectionName } from "../SectionsMeta/baseSectionsVarbs";
import { GetterSectionBase } from "./Bases/GetterSectionBase";
import { GetterSection } from "./GetterSection";

export class GetterVirtualVarb<
  SN extends SimpleSectionName
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
  get displayNameEnd(): string {
    return this.values.displayNameEnd.mainText;
  }
  get displayNameFull(): string {
    return this.displayName + this.displayNameEnd;
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
