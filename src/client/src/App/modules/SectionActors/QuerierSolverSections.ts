import {
  FeSectionInfo,
  FeVarbInfo,
} from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterSectionsProps } from "../../sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { StateSections } from "../../sharedWithServer/StateSections/StateSections";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { SolverVarb } from "../../sharedWithServer/StateSolvers/SolverVarb";
import { apiQueries } from "../apiQueriesClient";
import { QuerierFeStore } from "../FeStore/QuerierFeStore";
import { QuerierSolverSectionsBase } from "./QuerierSolverSectionsBase";

export class QuerierSolverSections extends QuerierSolverSectionsBase {
  static init(props: GetterSectionsProps): QuerierSolverSections {
    return new QuerierSolverSections({
      ...props,
      apiQueries: apiQueries,
      solveShare: { varbIdsToSolveFor: new Set() },
    });
  }
  get feStore() {
    return new QuerierFeStore(this.solverActorBaseProps);
  }
  get stateSections(): StateSections {
    return this.getterSections.stateSections;
  }
  solverSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SolverSection<S> {
    return this.solverSections.solverSection(feInfo);
  }
  solverVarb<S extends SectionName>(feVarbInfo: FeVarbInfo<S>): SolverVarb<S> {
    return this.solverSections.solverVarb(feVarbInfo);
  }
}
