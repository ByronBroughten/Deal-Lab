import hash from "object-hash";
import React from "react";
import { config } from "../../../Constants";
import { getStoredObj } from "../../../utils/localStorage";
import { SectionPack } from "../../SectionsMeta/childSectionsDerived/SectionPack";
import { feStoreNameS } from "../../SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { relSections } from "../../SectionsMeta/relSectionVarbs";
import { GetterSections } from "../../StateGetters/GetterSections";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { PackMakerSection } from "../../StatePackers.ts/PackMakerSection";
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
    const getterSections = new GetterSections({ sectionsShare: { sections } });
    const { mainFeInfo } = getterSections;

    const sectionPackMaker = new PackMakerSection({
      sectionsShare: { sections },
      ...mainFeInfo,
    });

    const mainSectionPack = sectionPackMaker.makeSectionPack();
    this.setSectionsInStore(mainSectionPack);
  }

  static getStoredSections(): StateSections {
    this.rmStoredStateIfPreframesChanged();
    const storedState = this.getSectionsFromStore();

    const mainBuilder = PackBuilderSection.loadAsOmniChild(storedState);
    const feUserBuilder = mainBuilder.onlyChild("feUser");
    const mainStoreNames = feStoreNameS.arrs.mainStoreName;
    const mainStorePackArrs =
      feUserBuilder.maker.makeChildPackArrs(mainStoreNames);
    feUserBuilder.updater.removeAllChildrenInArrs(mainStoreNames);

    const mainSolver = SolverSections.initSolverFromMainPack(
      mainBuilder.makeSectionPack()
    );
    const feUserSolver = mainSolver.onlyChild("feUser");
    feUserSolver.builder.replaceChildArrs(mainStorePackArrs);
    return mainSolver.sectionsShare.sections;
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
    const hashed = hash(relSections);
    const storedHash = localStorage.getItem(tokenKey.sectionsConfigHash);
    const relSectionsDidChange = hashed !== storedHash;
    if (relSectionsDidChange) return hashed;
    else return null;
  }
}

type StoredSectionsState = SectionPack<"main">;
export class StateMissingFromStorageError extends Error {}
