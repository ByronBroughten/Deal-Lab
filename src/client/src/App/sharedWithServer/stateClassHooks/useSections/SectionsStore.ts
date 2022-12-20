import hash from "object-hash";
import React from "react";
import { config } from "../../../Constants";
import { getStoredObj } from "../../../utils/localStorage";
import { relSections } from "../../SectionsMeta/relSectionsVarbs";
import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { validateSectionPackByType } from "../../SectionsMeta/SectionNameByType";
import { GetterSections } from "../../StateGetters/GetterSections";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { StateSections } from "../../StateSections/StateSections";
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
      ...main.onlyChild("activeDeal").feInfo,
    });
    const activeDealPack = packBuilder.makeSectionPack();
    this.setSectionsInStore(activeDealPack);
  }
  static getStoredSections(): StateSections {
    this.rmStoredStateIfPreframesChanged();
    const storedState = this.getSectionsFromStore();
    try {
      validateSectionPackByType(storedState, "deal");
    } catch (e) {
      this.rmStoredState();
      throw new Error("Failed to validate stored deal state.");
    }
    const main = SolverSections.initMainFromActiveDealPack(storedState);
    const feUser = main.onlyChild("feUser");
    feUser.updateValuesAndSolve({
      userDataStatus: "loading",
    });
    return main.sectionsShare.sections;

    // if (await auth.sessionExists()) {
    //   const feUser = main.onlyChild("feUser");
    //   feUser.updateValuesAndSolve({
    //     userDataStatus: "loading",
    //   });
    // }
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

type StoredSectionsState = SectionPack<"deal">;
export class StateMissingFromStorageError extends Error {}
