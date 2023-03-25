import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { validateSectionPackByType } from "../SectionsMeta/SectionNameByType";

export type UserData = {
  feStore: SectionPack<"feStore">;
};

export function validateUserData(value: any): UserData {
  const feStore = validateSectionPackByType(value.feStore, "feStore");
  return { feStore };
}
