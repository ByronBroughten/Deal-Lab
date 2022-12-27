import hash from "object-hash";
import React from "react";
import { config } from "../../../Constants";
import { getStoredObj } from "../../../utils/localStorage";
import { relSections } from "../../SectionsMeta/relSectionsVarbs";
import { ChildSectionPack } from "../../SectionsMeta/sectionChildrenDerived/ChildSectionPack";
import { validateSectionPackArrs } from "../../SectionsMeta/SectionNameByType";
import { GetterSections } from "../../StateGetters/GetterSections";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { StateSections } from "../../StateSections/StateSections";
import { SolverSection } from "../../StateSolvers/SolverSection";
import { SolverSections } from "../../StateSolvers/SolverSections";

type UseSectionsStoreProps = {
  storeSectionsLocally: boolean;
  sections: StateSections;
};
export function useLocalSectionsStore({
  storeSectionsLocally,
  sections,
}: UseSectionsStoreProps) {
  React.useEffect(() => {
    if (storeSectionsLocally) SectionsStore.rmStoredStateIfPreframesChanged();
  }, [storeSectionsLocally]);

  React.useEffect(() => {
    if (storeSectionsLocally) SectionsStore.storeSections(sections);
  }, [storeSectionsLocally, sections]);
}

const { tokenKey } = config;
export class SectionsStore {
  static storeSections(sections: StateSections): void {
    const getterSections = GetterSections.init({
      sections,
      sectionContextName: "default",
    });
    const { main } = getterSections;
    const packBuilder = new PackBuilderSection({
      ...getterSections.getterSectionsProps,
      ...main.feInfo,
    });

    this.setSectionsInStore(
      packBuilder.makeChildPackArrs(
        "activeDeal",
        "userVarbEditor",
        "userListEditor"
      )
    );
  }

  private static getAndValidateStoredState(): StoredSectionsState {
    const storedState = this.getSectionsFromStore();
    try {
      return validateSectionPackArrs(storedState, "main", storeChildNames);
    } catch (e) {
      this.rmStoredState();
      throw new Error("Failed to validate stored deal state.");
    }
  }
  private static initMainFromStoredState(
    storedState: StoredSectionsState
  ): SolverSection<"main"> {
    const solver = SolverSections.initRoot();
    const mainSolver = solver.addAndGetChild("main");
    mainSolver.builder.replaceChildArrs(storedState);
    return mainSolver;
  }
  static getStoredSections(): StateSections {
    this.rmStoredStateIfPreframesChanged();
    const storedState = this.getAndValidateStoredState();
    const main = this.initMainFromStoredState(storedState);
    const feUser = main.onlyChild("feUser");
    feUser.updateValuesAndSolve({
      userDataStatus: "loading",
    });
    return main.sectionsShare.sections;
  }
  private static setSectionsInStore(activeDealPack: StoredSectionsState) {
    localStorage.setItem(
      tokenKey.sectionsState,
      JSON.stringify(activeDealPack)
    );
  }
  private static getSectionsFromStore(): StoredSectionsState {
    const key = tokenKey.sectionsState;
    const sectionPack: StoredSectionsState | undefined = getStoredObj(key);
    if (sectionPack) return sectionPack;
    else
      throw new StateMissingFromStorageError(
        `No state is stored with tokenKey ${key}.`
      );
  }
  static rmStoredState() {
    localStorage.removeItem(tokenKey.sectionsState);
  }
  static rmStoredStateIfPreframesChanged() {
    const newHash = this.newHashIfRelSectionsDidChange();
    if (newHash) {
      localStorage.setItem(tokenKey.sectionsConfigHash, newHash);
      this.rmStoredState();
      localStorage.removeItem(tokenKey.userAuthData);
    }
  }
  private static newHashIfRelSectionsDidChange(): string | null {
    const hashed = hash(relSections);
    const storedHash = localStorage.getItem(tokenKey.sectionsConfigHash);
    const relSectionsDidChange = hashed !== storedHash;
    if (relSectionsDidChange) return hashed;
    else return null;
  }
}

const storeChildNames = [
  "activeDeal",
  "userVarbEditor",
  "userListEditor",
] as const;
type StoredChildName = typeof storeChildNames[number];

type StoredSectionsState = {
  [CN in StoredChildName]: ChildSectionPack<"main", CN>[];
};

export class StateMissingFromStorageError extends Error {}
