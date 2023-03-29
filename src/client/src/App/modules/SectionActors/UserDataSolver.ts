import { UserData } from "../../sharedWithServer/apiQueriesShared/validateUserData";
import { SolverSectionsBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionsBase";
import { SolverSections } from "../../sharedWithServer/StateSolvers/SolverSections";

export class UserDataSolver extends SolverSectionsBase {
  get solverSections() {
    return new SolverSections(this.solverSectionsProps);
  }
  loadUserData(userData: UserData): void {
    const { solverSections } = this;
    const main = solverSections.oneAndOnly("main");
    const feStore = main.onlyChild("feStore");
    feStore.loadSelfAndSolve(userData.feStore);
  }
}
