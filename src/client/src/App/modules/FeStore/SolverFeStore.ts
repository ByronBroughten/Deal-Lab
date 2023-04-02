import { shallowEqualObjects } from "shallow-equal";
import { isStoreNameByType } from "../../sharedWithServer/SectionsMeta/sectionStores";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { completedStatus } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
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
  private get updatesToSave() {
    return this.get.valueNext("toSaveUpdates");
  }
  private saveAttempt(feId: string) {
    return this.solver.child({
      childName: "saveAttempt",
      feId,
    });
  }
  addIdOfSectionToSave(sectionId: string) {
    this.basicSolvePrepper.updateValues({
      toSaveUpdates: {
        ...this.get.valueNext("toSaveUpdates"),
        [sectionId]: timeS.now(),
      },
    });
  }
  initializeSaveAttemptAndSolve() {
    const { saveAttempts } = this;
    saveAttempts.forEach((attempt) => {
      if (completedStatus.includes(attempt.value("attemptStatus") as any)) {
        attempt.prepper.removeSelf();
      }
    });
    const toSave = this.get.valueNext("toSaveUpdates");
    const saving = this.getterFeStore.initializedOrPendingUpdates;
    const nextSaving: StateValue<"sectionUpdates"> = {};
    if (!shallowEqualObjects(saving, toSave)) {
      const sectionIds = Obj.keys(toSave);
      for (const sectionId of sectionIds) {
        if (!(sectionId in saving) || toSave[sectionId] > saving[sectionId]) {
          nextSaving[sectionId] = toSave[sectionId];
        }
      }
    }
    this.basicSolvePrepper.addChild("saveAttempt", {
      sectionValues: {
        attemptStatus: "initialized",
        sectionUpdates: nextSaving,
      },
    });
    this.solver.solve();
  }
  preSaveAndSolve(saveAttemptId: string) {
    const saveAttempt = this.saveAttempt(saveAttemptId);
    const sectionIds = Obj.keys(saveAttempt.value("sectionUpdates"));

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
    saveAttempt.updateValuesAndSolve({
      attemptStatus: "pending",
    });
  }
  finishSaveAttempt({ success, feId }: { success: boolean; feId: string }) {
    const saveAttempt = this.saveAttempt(feId);
    if (success) {
      this.removeSavedUpdates(feId);
      saveAttempt.removeSelfAndSolve();
    } else {
      saveAttempt.updateValuesAndSolve({ attemptStatus: "failed" });
    }
  }

  private removeSavedUpdates(feId: string) {
    const savedUpdates = this.saveAttempt(feId).value("sectionUpdates");
    const { updatesToSave } = this;
    const nextToSave: StateValue<"sectionUpdates"> = {};

    const sectionIds = Obj.keys(updatesToSave);
    for (const sectionId of sectionIds) {
      if (
        !(sectionId in savedUpdates) ||
        updatesToSave[sectionId] > savedUpdates[sectionId]
      ) {
        nextToSave[sectionId] = updatesToSave[sectionId];
      }
    }
    this.basicSolvePrepper.updateValues({ toSaveUpdates: nextToSave });
  }
}
