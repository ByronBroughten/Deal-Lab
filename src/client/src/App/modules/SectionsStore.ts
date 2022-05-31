import hash from "object-hash";
import React from "react";
import { config } from "../Constants";
import { SectionPackRaw } from "../sharedWithServer/Analyzer/SectionPackRaw";
import { relSections } from "../sharedWithServer/SectionsMeta/relSections";
import { GetterSections } from "../sharedWithServer/StateGetters/GetterSections";
import { SectionPackMaker } from "../sharedWithServer/StatePackers.ts/SectionPackMaker";
import { StateSections } from "../sharedWithServer/StateSections/StateSectionsNext";
import { SolverSection } from "../sharedWithServer/StateSolvers/SolverSection";
import { getStoredObj } from "../utils/localStorage";

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
  }, []);

  React.useEffect(() => {
    if (storeSectionsLocally) SectionsStore.storeSections(sections);
  }, [storeSectionsLocally, sections]);
}

const { tokenKey } = config;
export class SectionsStore {
  static storeSections(sections: StateSections): void {
    const getterSections = new GetterSections({ sections });
    const { mainFeInfo } = getterSections;

    const sectionPackMaker = new SectionPackMaker({
      sectionsShare: { sections },
      ...mainFeInfo,
    });

    const mainSectionPack = sectionPackMaker.makeSectionPack();
    this.setSectionsInStore(mainSectionPack);
  }

  static getStoredSections(): StateSections {
    this.rmStoredStateIfPreframesChanged();
    const storedState = this.getSectionsFromStore();
    return SolverSection.initSolvedSectionsFromMainPack(storedState);
  }

  private static setSectionsInStore(mainSectionPack: StoredSectionsState) {
    localStorage.setItem(
      tokenKey.sectionsState,
      JSON.stringify(mainSectionPack)
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
  static rmStoredStateIfPreframesChanged() {
    const newHash = this.newHashIfRelSectionsDidChange();
    if (newHash) {
      localStorage.setItem(tokenKey.sectionsConfigHash, newHash);
      localStorage.removeItem(tokenKey.sectionsState);
      localStorage.removeItem(tokenKey.apiUserAuth);
    }
  }
  private static newHashIfRelSectionsDidChange(): string | null {
    // change this from relSections to SectionMetasRaw
    const hashed = hash(relSections);
    const storedHash = localStorage.getItem(tokenKey.sectionsConfigHash);
    const relSectionsDidChange = hashed !== storedHash;
    if (relSectionsDidChange) return hashed;
    else return null;
  }
}

type StoredSectionsState = SectionPackRaw<"main">;
export class StateMissingFromStorageError extends Error {}
