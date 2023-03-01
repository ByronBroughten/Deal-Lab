import { numObj } from "../../sharedWithServer/SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../sharedWithServer/SectionsMeta/values/StateValue/StringObj";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { MainSectionSolver } from "./MainSectionSolver";

describe("MainSectionSolver", () => {
  it("should load a section whose sectionPack passes an equality check with that of the section from which it was loaded", () => {
    const main = SolverSection.initDefaultMain();
    const feUser = main.onlyChild("feUser");
    const storeProperty = feUser.addAndGetChild("propertyMain");
    storeProperty.updateValuesAndSolve({
      purchasePrice: numObj(200000),
      displayName: stringObj("Store Property"),
    });

    const { feInfo } = main
      .onlyChild("activeDealPage")
      .onlyChild("deal")
      .onlyChild("property").get;

    const property = new MainSectionSolver({
      ...SolverSection.initProps({
        sections: main.sectionsShare.sections,
      }),
      ...feInfo,
    });

    const { dbId } = feUser.get.youngestChild("propertyMain");
    property.loadFromLocalStore(dbId);
    const { loaded, saved } = property.getPreppedSaveStatusPacks();
    expect(loaded).toEqual(saved);
  });
});
