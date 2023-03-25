import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { validateSectionPackByType } from "../SectionsMeta/SectionNameByType";

export type UserData = {
  feUser: SectionPack<"feUser">;
};

export function validateUserData(value: any): UserData {
  const feUser = validateSectionPackByType(value.feUser, "feUser");
  return { feUser };
}
