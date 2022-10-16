import { isEqual } from "lodash";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { AiOutlineSave } from "react-icons/ai";
import styled from "styled-components";
import { apiQueries } from "../../modules/apiQueriesClient";
import usePrompt from "../../modules/customHooks/useBlockerAndPrompt";
import { SectionArrQuerier } from "../../modules/QueriersBasic/SectionArrQuerier";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { SectionsContext } from "../../sharedWithServer/stateClassHooks/useSections";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { StateSections } from "../../sharedWithServer/StateSections/StateSections";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
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
  const workingListPack = makePackList(userListsContext.sections, storeName);
  const savedListPack = makePackList(userListsContext.savedSections, storeName);

  const areSaved = isEqual(workingListPack, savedListPack);
  async function saveUserLists() {
    const arrQuerier = new SectionArrQuerier({
      dbStoreName: storeName,
      apiQueries,
    });
    await arrQuerier.replace(workingListPack);
    unstable_batchedUpdates(() => {
      feUser.replaceChildArrs({
        [storeName]: workingListPack,
      });
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

function useUserListMainSection(storeName: FeStoreNameByType<"fullIndex">) {
  const feUser = useSetterSectionOnlyOne("feUser");
  const [sections, setSections] = React.useState(() => {
    const varbListPacks = feUser.packMaker.makeChildSectionPackArr(storeName);
    const sections = SolverSections.initSectionsFromDefaultMain();
    const packBuilder = SolverSection.init({
      ...sections.onlyOneRawSection("feUser"),
      sectionsShare: { sections },
    });
    packBuilder.loadChildPackArrsAndSolve({
      [storeName]: varbListPacks,
    });
    return packBuilder.sectionsShare.sections;
  });

  const [savedSections, setSavedSections] = React.useState(sections);
  return { sections, setSections, savedSections, setSavedSections };
}
