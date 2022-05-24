import hash from "object-hash";
import { config } from "../Constants";
import { SectionPackRaw } from "../sharedWithServer/Analyzer/SectionPackRaw";
import {
  SectionPackMaker,
  SectionPackMakerI,
} from "../sharedWithServer/SectionFocal/SectionPackMaker";
import { relSections } from "../sharedWithServer/SectionsMeta/relSections";
import { FeSections } from "../sharedWithServer/SectionsState/SectionsState";
import { GetterSections } from "../sharedWithServer/StateGetters/GetterSections";
import { getStoredObj } from "../utils/localStorage";

const { tokenKey } = config;
export class SectionsStore {
  static storeSections(sections: FeSections): void {
    const getterSections = new GetterSections({ sections });
    const { mainInfo } = getterSections;

    const sectionPackMaker = new SectionPackMaker({
      shared: { sections },
      ...mainInfo,
    }) as SectionPackMakerI<"main">;

    const mainSectionPack = sectionPackMaker.makeSectionPack();
    this.setSectionsInStore(mainSectionPack);
  }

  static getStoredSections(): FeSections {
    this.rmStoredStateIfPreframesChanged();
    const storedState = this.getSectionsFromStore();
    return FeSections.initFromSectionPack(storedState);
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
  private static rmStoredStateIfPreframesChanged() {
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
