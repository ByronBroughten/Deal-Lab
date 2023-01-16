import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { MainSectionSolver } from "./MainSectionSolver";

describe("MainSectionSolver", () => {
  it("should load a section whose sectionPack passes an equality check with that of the section from which it was loaded", () => {
    const main = SolverSection.initDefaultMain();
    const { feInfo } = main.onlyChild("activeDeal").onlyChild("property").get;

    const property = new MainSectionSolver({
      ...SolverSection.initProps({
        sections: main.sectionsShare.sections,
        sectionContextName: "activeDealPage",
      }),
      ...feInfo,
    });

    const { dbId } = main.onlyChild("feUser").get.children("propertyMain")[0];
    property.loadFromLocalStore(dbId);
    const { loaded, saved } = property.getPreppedSaveStatusPacks();
    expect(loaded).toEqual(saved);
  });
});
