import { constants } from "../../Constants";
import {
  SectionName,
  validateSectionName,
} from "../../stateSchemas/SectionName";
import { IdS } from "../../utils/IdS";
import { Str } from "../../utils/Str";

export const SectionId = {
  get sectionIdSplitter() {
    return constants.compoundIdSpliter;
  },
  make(sectionName: SectionName, feId: string) {
    return `${sectionName}${this.sectionIdSplitter}${feId}`;
  },
  split(sectionId: string): {
    sectionName: SectionName;
    feId: string;
  } {
    const [sectionName, feId] = sectionId.split(this.sectionIdSplitter);
    return { sectionName: sectionName as SectionName, feId };
  },
  validate(value: any): string {
    const str = Str.validate(value);
    const { sectionName, feId } = this.split(str);
    validateSectionName(sectionName);
    IdS.validate(feId);
    return str;
  },
};
