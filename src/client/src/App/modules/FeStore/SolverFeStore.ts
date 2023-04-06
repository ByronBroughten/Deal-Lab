import { isStoreNameByType } from "../../sharedWithServer/SectionsMeta/sectionStores";
import {
  changeSavingToToSave,
  ChangeToSave,
} from "../../sharedWithServer/SectionsMeta/values/StateValue/SectionUpdates";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { SolverAdderPrepSection } from "../../sharedWithServer/StateSolvers/SolverAdderPrepSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSectionsProps } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionsBase";
import { SolverPrepSection } from "../../sharedWithServer/StateSolvers/SolverPrepSection";
import { SolverPrepSections } from "../../sharedWithServer/StateSolvers/SolverPrepSections";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { timeS } from "../../sharedWithServer/utils/date";
import { Obj } from "../../sharedWithServer/utils/Obj";
import { GetterFeStore } from "./GetterFeStore";

export class SolverFeStore extends SolverSectionBase<"feStore"> {
  constructor(props: SolverSectionsProps) {
    super({
      ...props.sectionsShare.sections.onlyOneRawSection("feStore"),
      ...props,
    });
  }
  get getterFeStore(): GetterFeStore {
    return new GetterFeStore(this.getterSectionsBase.getterSectionsProps);
  }
  get get(): GetterSection<"feStore"> {
    return new GetterSection(this.getterSectionProps);
  }
  get getterSections(): GetterSections {
    return new GetterSections(this.getterSectionProps);
  }
  get solver(): SolverSection<"feStore"> {
    return new SolverSection(this.solverSectionProps);
  }
  get saveAttempts() {
    return this.solver.children("saveAttempt");
  }
  get appWideSolvePrepSections(): SolverPrepSections {
    return new SolverPrepSections(this.solverSectionsProps);
  }
  get appWideSolvePrepper(): SolverPrepSection<"feStore"> {
    return new SolverPrepSection(this.solverSectionProps);
  }
  get basicSolvePrepper(): SolverAdderPrepSection<"feStore"> {
    return new SolverAdderPrepSection(this.solverSectionProps);
  }
  addChangeToSave(sectionId: string, change: ChangeToSave) {
    const toSave = { ...this.get.valueNext("changesToSave") };
    switch (change.changeName) {
      case "add":
      case "remove": {
        toSave[sectionId] = change;
        break;
      }
      case "update": {
        if (!toSave[sectionId]) {
          toSave[sectionId] = change;
        }
      }
    }
    this.basicSolvePrepper.updateValues({
      changesToSave: toSave,
      timeOfLastChange: timeS.now(),
    });
  }
  onChangeIdle(): void {
    this.basicSolvePrepper.updateValues({
      timeOfChangeIdle: timeS.now(),
    });

    const { areSomeToSave, noneSaving } = this.getterFeStore;
    if (areSomeToSave && noneSaving) {
      this.initiateSave();
    }
  }
  private initiateSave() {
    this.preSaveAndSolve();
    this.basicSolvePrepper.updateValues({
      timeOfSave: timeS.now(),
      changesSaving: this.getterFeStore.toSaveToSaving(),
      changesToSave: {},
      saveFailed: false,
    });
  }
  private preSaveAndSolve() {
    const sectionIds = Obj.keys(this.get.valueNext("changesToSave"));
    let doVariableUpdate = false;
    for (const sectionId of sectionIds) {
      const section = this.getterSections.sectionBySectionId(sectionId);
      const { selfChildName } = section;
      if (isStoreNameByType(selfChildName, "variableStore")) {
        doVariableUpdate = true;
        break;
      }
    }
    if (doVariableUpdate) {
      this.appWideSolvePrepSections.applyVariablesToDealPages();
    }
  }
  finishSave({ success }: { success: boolean }) {
    if (success) {
      this.basicSolvePrepper.updateValues({ changesSaving: {} });
      if (this.getterFeStore.nextSaveIsDue) {
        this.initiateSave();
      }
    } else {
      this.handleFailedSave();
    }
  }
  private handleFailedSave() {
    const failedChanges = this.get.valueNext("changesSaving");
    for (const sectionId of Obj.keys(failedChanges)) {
      const failedChange = changeSavingToToSave(failedChanges[sectionId]);
      this.reIntegrateFailedChanges(sectionId, failedChange);
    }
    this.basicSolvePrepper.updateValues({
      changesSaving: {},
      saveFailed: true,
    });
  }
  private reIntegrateFailedChanges(
    sectionId: string,
    failedChange: ChangeToSave
  ) {
    const toSave = { ...this.get.valueNext("changesToSave") };
    const currentChange = toSave[sectionId];
    if (!currentChange) {
      toSave[sectionId] = failedChange;
    } else {
      switch (currentChange.changeName) {
        case "add": {
          throw new Error(
            "An add was attempted after other changes, presumably after another add."
          );
        }
        case "update": {
          toSave[sectionId] = failedChange;
          break;
        }
        case "remove": {
          switch (failedChange.changeName) {
            case "add": {
              delete toSave[sectionId];
              break;
            }
            case "remove": {
              throw new Error("A remove was attempted after another remove.");
            }
          }
        }
      }
    }
    this.basicSolvePrepper.updateValues({ changesToSave: toSave });
  }
}
