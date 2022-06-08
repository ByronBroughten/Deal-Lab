import { SectionPackBuilder } from "../../../../../../StatePackers.ts/PackBuilderSection";

export function makeDefaultUser() {
  const main = new SectionPackBuilder();
  const user = main.addAndGetChild("user", {
    dbVarbs: {
      email: "",
      userName: "Guest",
      apiAccessStatus: "readonly",
    },
  });
  return user.makeSectionPack();
}
