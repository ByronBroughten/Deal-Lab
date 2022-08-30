import { isEqual } from "lodash";
import React from "react";
import { AiOutlineSave } from "react-icons/ai";
import styled from "styled-components";
import { apiQueries } from "../../modules/apiQueriesClient";
import { SectionArrQuerier } from "../../modules/QueriersBasic/SectionArrQuerier";
import { SectionsContext } from "../../sharedWithServer/stateClassHooks/useSections";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SolverSections } from "../../sharedWithServer/StateSolvers/SolverSections";
import MainSection from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import MainSectionTitleBtn from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionTitleBtn";
import { UserVarbListSectionEntry } from "./UserVarbListSectionEntry";

function useSaveUserVarbLists() {
  const feUser = useSetterSectionOnlyOne("feUser");
  const userVarbListsContext = useUserVarbListSections();

  const mainListPack =
    feUser.packMaker.makeChildSectionPackArr("userVarbListMain");

  const workingPackMaker = PackMakerSection.makeFromSections({
    sections: userVarbListsContext.sections,
    sectionName: "feUser",
  });
  const workingListPack =
    workingPackMaker.makeChildSectionPackArr("userVarbListMain");

  const areSaved = isEqual(workingListPack, mainListPack);
  async function saveUserVarbLists() {
    const workingPackArr =
      workingPackMaker.makeChildSectionPackArr("userVarbListMain");
    const arrQuerier = new SectionArrQuerier({
      dbStoreName: "userVarbListMain",
      apiQueries,
    });
    await arrQuerier.replace(workingPackArr);
    feUser.loadChildPackArrs({
      userVarbListMain: workingPackArr,
    });
  }

  return {
    userVarbListsContext,
    saveUserVarbLists,
    areSaved,
  };
}

export function UserVarbListSection() {
  const { saveUserVarbLists, areSaved, userVarbListsContext } =
    useSaveUserVarbLists();
  const saveBtnProps = {
    ...(areSaved
      ? {
          disabled: true,
          text: "Saved",
        }
      : { disabled: false, text: "Save" }),
  };

  return (
    <SectionsContext.Provider value={userVarbListsContext}>
      <Styled themeName="userVarbList" className="UserVarbListSection-root">
        <GeneralSectionTitle title="Variables" themeName="userVarbList">
          <MainSectionTitleBtn
            themeName="userVarbList"
            className="GeneralSectionTitle-child"
            onClick={saveUserVarbLists}
            {...{
              ...saveBtnProps,
              icon: <AiOutlineSave size="25" />,
            }}
          />
        </GeneralSectionTitle>
        <div className="MainSection-entries">
          <UserVarbListSectionEntry />
        </div>
      </Styled>
    </SectionsContext.Provider>
  );
}

const Styled = styled(MainSection)`
  .GeneralSectionTitle-child {
    width: 50%;
  }
`;

function useUserVarbListSections() {
  // I'll want to load all the full sections when those
  // totals become usable.
  const feUser = useSetterSectionOnlyOne("feUser");
  const [sections, setSections] = React.useState(() => {
    const varbListPacks =
      feUser.packMaker.makeChildSectionPackArr("userVarbListMain");
    const sections = SolverSections.initSectionsFromDefaultMain();
    const packBuilder = new PackBuilderSection({
      ...sections.onlyOneRawSection("feUser"),
      sectionsShare: { sections },
    });
    packBuilder.loadChildren({
      childName: "userVarbListMain",
      sectionPacks: varbListPacks,
    });
    return packBuilder.sectionsShare.sections;
  });
  return { sections, setSections };
}
