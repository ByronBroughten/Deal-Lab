import isEqual from "fast-deep-equal";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { apiQueries } from "../../modules/apiQueriesClient";
import { SectionArrQuerier } from "../../modules/QueriersBasic/SectionArrQuerier";
import {
  FeStoreNameByType,
  feStoreNameS,
} from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { useSections } from "../../sharedWithServer/stateClassHooks/useSections";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { StateSections } from "../../sharedWithServer/StateSections/StateSections";
import { SolverSections } from "../../sharedWithServer/StateSolvers/SolverSections";

export function useSaveUserLists(
  storeName: FeStoreNameByType<"fullIndexWithArrStore">
) {
  const feUser = useSetterSectionOnlyOne("feUser");
  const userListsContext = useUserListMainSection();
  function makeWorkingPackList() {
    return makePackList(userListsContext.sections, storeName);
  }

  const [areSaved, setAreSaved] = React.useState(true);
  React.useEffect(() => {
    let doIt = true;
    setTimeout(() => {
      if (doIt) {
        const workingPackList = makeWorkingPackList();
        const savedPackList = makePackList(
          userListsContext.savedSections,
          storeName
        );
        const nextAreSaved = isEqual(workingPackList, savedPackList);
        setAreSaved(nextAreSaved);
      }
    }, 700);
  });
  async function saveUserLists() {
    const arrQuerier = new SectionArrQuerier({
      dbStoreName: storeName,
      apiQueries,
    });
    const workingPackList = makeWorkingPackList();
    await arrQuerier.replace(workingPackList);
    unstable_batchedUpdates(() => {
      feUser.replaceChildArrs({
        [storeName]: workingPackList,
      } as any);
      userListsContext.setSavedSections(userListsContext.sections);
    });
  }
  return {
    userListsContext,
    saveUserLists,
    areSaved,
  };
}

function makePackList<CN extends FeStoreNameByType<"fullIndex">>(
  sections: StateSections,
  storeName: CN
) {
  const packMaker = PackMakerSection.makeFromSections({
    sections: sections,
    sectionName: "feUser",
  });
  return packMaker.makeChildSectionPackArr(storeName);
}

function useUserListMainSection() {
  const initUserListSections = useInitUserListSections();
  const [sections, setSections, sectionsDispatch] =
    useSections(initUserListSections);
  const [savedSections, setSavedSections, savedSectionsDispatch] = useSections(
    () => sections
  );
  return {
    sections,
    setSections,
    sectionsDispatch,
    savedSections,
    setSavedSections,
    savedSectionsDispatch,
  };
}
function useInitUserListSections(): () => StateSections {
  const main = useSetterSectionOnlyOne("main");
  const feUser = main.onlyChild("feUser");
  const activeDeal = main.onlyChild("activeDeal");
  return () => {
    const activeDealPack = activeDeal.packMaker.makeSectionPack();
    const packArrs = feUser.packMaker.makeChildPackArrs(
      feStoreNameS.arrs.saveUserLists
    );
    return SolverSections.initSaveUserListSections(activeDealPack, packArrs);
  };
}
