import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultUser() {
  const user = PackBuilderSection.initAsOmniChild("user", {
    dbVarbs: {
      email: "",
      userName: "Guest",
      apiAccessStatus: "readonly",
    },
  });
  return user.makeSectionPack();
}
