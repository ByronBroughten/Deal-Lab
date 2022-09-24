import { SectionPack } from "../../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { SolverSectionsBase } from "../../../sharedWithServer/StateSolvers/SolverBases/SolverSectionsBase";
import { SolverSections } from "../../../sharedWithServer/StateSolvers/SolverSections";

export class LoginSolver extends SolverSectionsBase {
  get solverSections() {
    return new SolverSections(this.solverSectionsProps);
  }
  setLogin(feUserPack: SectionPack<"feUser">) {
    const feUser = this.solverSections.oneAndOnly("feUser");
    feUser.loadSelfSectionPackAndSolve(feUserPack);
    const authInfo = feUser.onlyChild("authInfo");
    authInfo.varb("authStatus").directUpdateAndSolve("user");
  }
}
