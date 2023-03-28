import { numObj } from "../../sharedWithServer/SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../sharedWithServer/SectionsMeta/values/StateValue/StringObj";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { SolverSections } from "../../sharedWithServer/StateSolvers/SolverSections";
import { MainSectionSolver } from "./MainSectionSolver";

describe("MainSectionSolver", () => {
  it("should load a section whose sectionPack passes an equality check with that of the section from which it was loaded", () => {
    const main = SolverSection.initDefaultMain();
    const feStore = main.onlyChild("feStore");
    const storeProperty = feStore.addAndGetChild("propertyMain");
    storeProperty.updateValuesAndSolve({
      purchasePrice: numObj(200000),
      displayName: stringObj("Store Property"),
    });
    const { dbId } = storeProperty.get;

    const activeDeal = main.solverSections.getActiveDeal();
    const activeProperty = activeDeal.onlyChild("property").get;
    const mainProperty = new MainSectionSolver({
      ...SolverSections.initProps({ sections: main.sectionsShare.sections }),
      ...activeProperty.feInfo,
    });

    mainProperty.loadFromLocalStore(dbId);
    const { loaded, saved } = mainProperty.getPreppedSaveStatusPacks();
    expect(loaded).toEqual(saved);
  });
});
