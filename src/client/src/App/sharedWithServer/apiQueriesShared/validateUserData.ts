import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { validateSectionPackDuck } from "../SectionsMeta/sectionChildrenDerived/validateSectionPackDuck";
import { Obj } from "../utils/Obj";

export type UserData = {
  feStore: SectionPack<"feStore">;
  sessionStore: SectionPack<"sessionStore">;
};

export function validateUserData(value: any): UserData {
  const obj = Obj.validateObjToAny(value) as UserData;
  return {
    feStore: validateSectionPackDuck(obj.feStore, "feStore"),
    sessionStore: validateSectionPackDuck(obj.sessionStore, "sessionStore"),
  };
}
