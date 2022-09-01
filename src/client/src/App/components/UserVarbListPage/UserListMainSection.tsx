import { isEqual } from "lodash";
import React from "react";
import { AiOutlineSave } from "react-icons/ai";
import styled from "styled-components";
import { apiQueries } from "../../modules/apiQueriesClient";
import usePrompt from "../../modules/customHooks/useBlockerAndPrompt";
import { SectionArrQuerier } from "../../modules/QueriersBasic/SectionArrQuerier";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/feStoreNameArrs";
import { SectionsContext } from "../../sharedWithServer/stateClassHooks/useSections";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SolverSections } from "../../sharedWithServer/StateSolvers/SolverSections";
import theme, { ThemeName } from "../../theme/Theme";
import MainSection from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import MainSectionTitleBtn from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionTitleBtn";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { UserListSectionEntry } from "./UserListSectionEntry";

function useSaveUserLists(storeName: FeStoreNameByType<"fullIndex">) {
  const feUser = useSetterSectionOnlyOne("feUser");
  const userListsContext = useUserListMainSection(storeName);

  const mainListPack = feUser.packMaker.makeChildSectionPackArr(storeName);

  const workingPackMaker = PackMakerSection.makeFromSections({
    sections: userListsContext.sections,
    sectionName: "feUser",
  });
  const workingListPack = workingPackMaker.makeChildSectionPackArr(storeName);

  const areSaved = isEqual(workingListPack, mainListPack);
  async function saveUserLists() {
    const workingPackArr = workingPackMaker.makeChildSectionPackArr(storeName);
    const arrQuerier = new SectionArrQuerier({
      dbStoreName: storeName,
      apiQueries,
    });
    await arrQuerier.replace(workingPackArr);
    feUser.loadChildPackArrs({
      [storeName]: workingPackArr,
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
  storeName: FeStoreNameByType<"fullIndex">;
  title: string;
  makeListNode: MakeListNode;
};
export function UserListMainSection({
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
    <Styled themeName={themeName} className="UserListMainSection-root">
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

const Styled = styled(MainSection)`
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
    const packBuilder = new PackBuilderSection({
      ...sections.onlyOneRawSection("feUser"),
      sectionsShare: { sections },
    });
    packBuilder.loadChildren({
      childName: storeName,
      sectionPacks: varbListPacks,
    });
    return packBuilder.sectionsShare.sections;
  });
  return { sections, setSections };
}
