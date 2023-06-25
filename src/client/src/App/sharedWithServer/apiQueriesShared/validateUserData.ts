import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { validateSectionPackDuck } from "../SectionsMeta/sectionChildrenDerived/validateSectionPackDuck";

export type UserData = {
  feStore: SectionPack<"feStore">;
};

export function validateUserData(value: any): UserData {
  const feStore = validateSectionPackDuck(value.feStore, "feStore");
  return { feStore };
}
