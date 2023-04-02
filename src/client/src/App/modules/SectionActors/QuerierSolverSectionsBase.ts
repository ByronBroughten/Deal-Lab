import { GetterSectionsProps } from "../../sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import {
  SolverSectionsBase,
  SolverSectionsProps,
} from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionsBase";
import { SolverSections } from "../../sharedWithServer/StateSolvers/SolverSections";
import {
  ApiQuerierBase,
  ApiQuerierBaseProps,
} from "../QueriersBasic/Bases/ApiQuerierBase";

export interface QuerierSolverSectionsBaseProps
  extends ApiQuerierBaseProps,
    SolverSectionsProps {}

export class QuerierSolverSectionsBase extends ApiQuerierBase {
  readonly solverSectionsBase: SolverSectionsBase;
  constructor(props: QuerierSolverSectionsBaseProps) {
    super(props);
    this.solverSectionsBase = new SolverSectionsBase(props);
  }
  get getterSectionsProps(): GetterSectionsProps {
    return {
      sectionsShare: this.solverSectionsBase.sectionsShare,
    };
  }
  get solverSectionsProps(): SolverSectionsProps {
    return this.solverSectionsBase.solverSectionsProps;
  }
  get solverActorBaseProps(): QuerierSolverSectionsBaseProps {
    return {
      ...this.solverSectionsProps,
      apiQueries: this.apiQueries,
    };
  }
  get getterSections() {
    return new GetterSections(this.getterSectionsProps);
  }
  get solverSections() {
    return new SolverSections(this.solverSectionsProps);
  }
}
