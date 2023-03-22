import { UserData } from "../../../sharedWithServer/apiQueriesShared/validateUserData";
import { listChildrenNames } from "../../../sharedWithServer/SectionsMeta/sectionStores";
import { SolverSectionsBase } from "../../../sharedWithServer/StateSolvers/SolverBases/SolverSectionsBase";
import { SolverSections } from "../../../sharedWithServer/StateSolvers/SolverSections";

export class UserDataSolver extends SolverSectionsBase {
  get solverSections() {
    return new SolverSections(this.solverSectionsProps);
  }
  loadUserData(userData: UserData): void {
    const { solverSections } = this;
    const main = solverSections.oneAndOnly("main");
    const feUser = main.onlyChild("feUser");
    feUser.loadSelf(userData.feUser);

    const varbEditor = main.onlyChild("userVarbEditor");
    varbEditor.replaceChildPackArrsAndSolve(
      feUser.builder.makeChildPackArrs("numVarbListMain")
    );
    const listEditor = main.onlyChild("userListEditor");
    listEditor.replaceChildPackArrsAndSolve(
      feUser.builder.makeChildPackArrs(...listChildrenNames)
    );
  }
}
