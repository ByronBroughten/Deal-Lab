import hash from "object-hash";
import React from "react";
import { config } from "../../../Constants";
import { getStoredObj } from "../../../utils/localStorage";
import { makeDefaultMain } from "../../defaultMaker/makeDefaultMain";
import { allBaseSectionVarbs } from "../../SectionsMeta/allBaseSectionVarbs";
import { ChildSectionPack } from "../../SectionsMeta/sectionChildrenDerived/ChildSectionPack";
import {
  SectionPack,
  validateSectionPackNext,
} from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
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

    const feUser = main.onlyChild("feUser");
    const authStatus = feUser.valueNext("authStatus");

    const activeDeal = packBuilder
      .onlyChild("activeDealPage")
      .onlyChild("deal");

    this.setSectionsInStore({
      activeDeal: activeDeal.makeSectionPack(),
      ...packBuilder.makeChildPackArrs(
        "userVarbEditor",
        "userListEditor",
        ...(authStatus === "guest" ? (["feUser"] as const) : [])
      ),
    });
  }

  private static getAndValidateStoredState(): StoredSectionsState {
    const storedState = this.getSectionsFromStore();
    const { activeDeal, ...rest } = storedState;
    try {
      return {
        activeDeal: validateSectionPackNext(activeDeal),
        ...validateSectionPackArrs(rest, "main", [
          ...storeChildNames,
          optionalStoreName,
        ]),
      };
    } catch (e) {
      this.rmStoredState();
      throw new Error("Failed to validate stored deal state.");
    }
  }
  private static initMainFromStoredState(
    storedState: StoredSectionsState
  ): SolverSection<"main"> {
    const { activeDeal, ...rest } = storedState;
    const main = PackBuilderSection.initAsOmniChild("main");
    main.loadSelf(makeDefaultMain());
    main.replaceChildArrs(rest);

    const deal = main.onlyChild("activeDealPage").onlyChild("deal");
    deal.loadSelf(activeDeal);

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

const storeChildNames = ["userVarbEditor", "userListEditor"] as const;
type StoredChildName = typeof storeChildNames[number];
const optionalStoreName = "feUser";
type OptionalStoreName = typeof optionalStoreName;

type StoredSectionsState = {
  activeDeal: SectionPack<"deal">;
} & {
  [CN in StoredChildName]: ChildSectionPack<"main", CN>[];
} & {
  [CN in OptionalStoreName]?: ChildSectionPack<"main", CN>[];
};

export class StateMissingFromStorageError extends Error {}
