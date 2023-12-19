import hash from "object-hash";
import React from "react";

import { config } from "../../../sharedWithServer/Constants";
import {
  ChildSectionPack,
  validateSectionPackArrs,
} from "../../../sharedWithServer/SectionPack/ChildSectionPack";
import { StateSections } from "../../../sharedWithServer/State/StateSections";
import { PackBuilderSection } from "../../../sharedWithServer/StateClasses/Packers/PackBuilderSection";
import { SolverSection } from "../../../sharedWithServer/StateClasses/Solvers/SolverSection";
import { SolverSections } from "../../../sharedWithServer/StateClasses/Solvers/SolverSections";
import { GetterSections } from "../../../sharedWithServer/StateGetters/GetterSections";
import { makeDefaultMain } from "../../../sharedWithServer/defaultMaker/makeDefaultMain";
import { allBaseSectionVarbs } from "../../../sharedWithServer/sectionVarbsConfig/allBaseSectionVarbs";
import { getStoredObj } from "../../utils/localStorage";

const storeChildNames = [
  "newDealMenu",
  "mainDealMenu",
  "variablesMenu",
  "editorControls",
  "dealCompareDealSelectMenu",
] as const;
type StoredChildName = (typeof storeChildNames)[number];

type StoredSectionsState = {
  [CN in StoredChildName]: ChildSectionPack<"main", CN>[];
};

type UseSectionsStoreProps = {
  storeSectionsLocally: boolean;
  sections: StateSections;
};
export function useLocalSectionsStore({
  storeSectionsLocally,
  sections,
}: UseSectionsStoreProps) {
  React.useEffect(() => {
    if (storeSectionsLocally)
      SectionsStore.rmStoredStateIfBaseSectionVarbsChange();
  }, [storeSectionsLocally]);

  React.useEffect(() => {
    if (storeSectionsLocally) {
      setTimeout(() => {
        SectionsStore.storeSections(sections);
      }, 5000);
    }
  }, [storeSectionsLocally, sections]);
}

const { tokenKey } = config;
export class SectionsStore {
  static storeSections(sections: StateSections): void {
    const getterSections = GetterSections.init({ sections });
    const { main } = getterSections;
    const packBuilder = new PackBuilderSection({
      ...getterSections.getterSectionsProps,
      ...main.feInfo,
    });

    this.setSectionsInStore(packBuilder.makeChildPackArrs(...storeChildNames));
  }

  private static getAndValidateStoredState(): StoredSectionsState {
    const storedState = this.getSectionsFromStore();
    try {
      return validateSectionPackArrs(storedState, "main", storeChildNames);
    } catch (e) {
      this.rmStoredState();
      throw e;
    }
  }
  private static initMainFromStoredState(
    storedState: StoredSectionsState
  ): SolverSection<"main"> {
    const main = PackBuilderSection.initAsOmniChild("main");
    main.overwriteSelf(makeDefaultMain());
    main.replaceChildArrs(storedState);
    const solver = SolverSections.initRoot();
    return solver.loadAndGetChild({
      childName: "main",
      sectionPack: main.makeSectionPack(),
    });
  }
  static getStoredSections(): StateSections {
    this.rmStoredStateIfBaseSectionVarbsChange();
    const storedState = this.getAndValidateStoredState();
    const main = this.initMainFromStoredState(storedState);
    return main.sectionsShare.sections;
  }
  private static setSectionsInStore(stateToStore: StoredSectionsState) {
    localStorage.setItem(tokenKey.sectionsState, JSON.stringify(stateToStore));
  }
  private static getSectionsFromStore(): StoredSectionsState {
    const key = tokenKey.sectionsState;
    const storedState: StoredSectionsState | undefined = getStoredObj(key);
    if (storedState) return storedState;
    else
      throw new StateMissingFromStorageError(
        `No state is stored with tokenKey ${key}.`
      );
  }
  static rmStoredState() {
    localStorage.removeItem(tokenKey.sectionsState);
  }
  static rmStoredStateIfBaseSectionVarbsChange() {
    const newHash = this.newHashIfbaseSectionsVarbsChanged();
    if (newHash) {
      localStorage.setItem(tokenKey.sectionsConfigHash, newHash);
      this.rmStoredState();
      localStorage.removeItem(tokenKey.userAuthData);
    }
  }
  private static newHashIfbaseSectionsVarbsChanged(): string | null {
    const hashed = hash(allBaseSectionVarbs);
    const storedHash = localStorage.getItem(tokenKey.sectionsConfigHash);
    const baseSectionsVarbsChanged = hashed !== storedHash;
    if (baseSectionsVarbsChanged) return hashed;
    else return null;
  }
}

export class StateMissingFromStorageError extends Error {}
