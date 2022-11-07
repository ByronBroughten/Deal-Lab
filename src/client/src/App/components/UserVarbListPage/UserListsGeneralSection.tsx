import { isEqual } from "lodash";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { AiOutlineSave } from "react-icons/ai";
import styled from "styled-components";
import { apiQueries } from "../../modules/apiQueriesClient";
import usePrompt from "../../modules/customHooks/useBlockerAndPrompt";
import { SectionArrQuerier } from "../../modules/QueriersBasic/SectionArrQuerier";
import {
  FeStoreNameByType,
  feStoreNameS,
} from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import {
  SectionsContext,
  SectionsDispatchContext,
  useSections,
} from "../../sharedWithServer/stateClassHooks/useSections";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { StateSections } from "../../sharedWithServer/StateSections/StateSections";
import { SolverSections } from "../../sharedWithServer/StateSolvers/SolverSections";
import theme, { ThemeName } from "../../theme/Theme";
import { GeneralSection } from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import MainSectionTitleBtn from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionTitleBtn";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { UserListSectionEntry } from "./UserListSectionEntry";

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

function useSaveUserLists(
  storeName: FeStoreNameByType<"fullIndexWithArrStore">
) {
  const feUser = useSetterSectionOnlyOne("feUser");
  const userListsContext = useUserListMainSection(storeName);
  const workingPackList = makePackList(userListsContext.sections, storeName);
  const savedPackList = makePackList(userListsContext.savedSections, storeName);

  const areSaved = isEqual(workingPackList, savedPackList);
  async function saveUserLists() {
    const arrQuerier = new SectionArrQuerier({
      dbStoreName: storeName,
      apiQueries,
    });
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

type Props = {
  themeName: ThemeName;
  storeName: FeStoreNameByType<"fullIndexWithArrStore">;
  title: string;
  makeListNode: MakeListNode;
};
export function UserListsGeneralSection({
  themeName,
  storeName,
  title,
  makeListNode,
}: Props) {
  const { saveUserLists, areSaved, userListsContext } =
    useSaveUserLists(storeName);
  const saveBtnProps = {
    ...(areSaved
      ? {
          disabled: true,
          text: "Saved",
        }
      : { disabled: false, text: "Save" }),
  };

  usePrompt(
    "Your unsaved changes will be lost when you leave. Are you sure you want to leave?",
    !areSaved
  );

  return (
    <Styled themeName={themeName} className="UserListsGeneralSection-root">
      <SectionsContext.Provider value={userListsContext}>
        <SectionsDispatchContext.Provider
          value={userListsContext.sectionsDispatch}
        >
          <GeneralSectionTitle title={title} themeName={themeName}>
            <MainSectionTitleBtn
              themeName={themeName}
              className="UserListMain-saveBtn"
              onClick={saveUserLists}
              {...{
                ...saveBtnProps,
                icon: <AiOutlineSave size="25" />,
              }}
            />
          </GeneralSectionTitle>
          <div className="MainSection-entries">
            <UserListSectionEntry
              {...{
                themeName,
                storeName,
                makeListNode,
              }}
            />
          </div>
        </SectionsDispatchContext.Provider>
      </SectionsContext.Provider>
    </Styled>
  );
}

const Styled = styled(GeneralSection)`
  .UserListSectionEntry-root {
    padding-bottom: ${theme.s2};
  }
  .UserListMain-saveBtn {
    width: 50%;
  }
`;

function useInitUserListSections(
  storeName: FeStoreNameByType<"fullIndex">
): () => StateSections {
  const main = useSetterSectionOnlyOne("main");
  const feUser = main.onlyChild("feUser");
  const activeDeal = main.onlyChild("activeDeal");
  return () => {
    const packArrs = feUser.packMaker.makeChildPackArrs(
      feStoreNameS.arrs.userListStoreName
    );

    const mainNext = SolverSections.initMainFromActiveDealPack(
      activeDeal.packMaker.makeSectionPack()
    );
    const feUserNext = mainNext.onlyChild("feUser");
    feUserNext.replaceChildPackArrsAndSolve(packArrs);
    return feUserNext.sectionsShare.sections;
  };
}

function useUserListMainSection(storeName: FeStoreNameByType<"fullIndex">) {
  const initUserListSections = useInitUserListSections(storeName);
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
