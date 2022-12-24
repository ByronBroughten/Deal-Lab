import { UserData } from "../../../sharedWithServer/apiQueriesShared/getUserData";
import { SolverSectionsBase } from "../../../sharedWithServer/StateSolvers/SolverBases/SolverSectionsBase";
import { SolverSections } from "../../../sharedWithServer/StateSolvers/SolverSections";

export class UserDataSolver extends SolverSectionsBase {
  get solverSections() {
    return new SolverSections(this.solverSectionsProps);
  }
  loadUserData(userData: UserData): void {
    const { solverSections } = this;

    const feUser = solverSections.oneAndOnly("feUser");
    feUser.loadSelf(userData.feUser);
    feUser.replaceChildPackArrsAndSolve(userData.mainStoreArrs);
  }
}
