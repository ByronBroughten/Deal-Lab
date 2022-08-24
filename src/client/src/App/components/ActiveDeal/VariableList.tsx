import React from "react";
import { AiOutlineSave } from "react-icons/ai";
import { SectionsContext } from "../../../App/sharedWithServer/stateClassHooks/useSections";
import { apiQueries } from "../../modules/apiQueriesClient";
import { SectionArrQuerier } from "../../modules/QueriersBasic/SectionArrQuerier";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SolverSections } from "../../sharedWithServer/StateSolvers/SolverSections";
import MainSection from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import MainSectionBody from "../appWide/GeneralSection/MainSection/MainSectionBody";
import { ListGroupLists } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import MainSectionTitleBtn from "./../appWide/GeneralSection/GeneralSectionTitle/MainSectionTitleBtn";
import { VarbListUserVarbs } from "./../appWide/VarbLists/VarbListUserVarbs";

export function VariableListSection() {
  const feUser = useSetterSectionOnlyOne("feUser");
  const varbListSectionsContext = useUserVarbListSections();

  async function saveVariableLists() {
    const packMaker = PackMakerSection.makeFromSections({
      sections: varbListSectionsContext.sections,
      sectionName: "feUser",
    });
    const sectionPackArr =
      packMaker.makeChildSectionPackArr("userVarbListMain");
    const arrQuerier = new SectionArrQuerier({
      dbStoreName: "userVarbListMain",
      apiQueries,
    });

    await arrQuerier.replace(sectionPackArr);
    feUser.loadChildPackArrs({
      userVarbListMain: packMaker.makeChildSectionPackArr("userVarbListMain"),
    });
  }

  return (
    <SectionsContext.Provider value={varbListSectionsContext}>
      <MainSection
        themeName="userVarbList"
        className="VariableListSection-root"
      >
        <GeneralSectionTitle title="Variables" themeName="userVarbList">
          <MainSectionTitleBtn
            themeName="userVarbList"
            className="GeneralSectionTitle-child"
            onClick={saveVariableLists}
            {...{
              text: "Save",
              icon: <AiOutlineSave size="25" />,
            }}
          />
        </GeneralSectionTitle>
        <div>
          <VariableListSectionEntry />
        </div>
      </MainSection>
    </SectionsContext.Provider>
  );
}

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

function VariableListSectionEntry() {
  const feUser = useSetterSectionOnlyOne("feUser");
  return (
    <MainSection themeName="userVarbList">
      {/* Row with Save btn */}
      <MainSectionBody themeName="userVarbList">
        <ListGroupLists
          {...{
            themeName: "userVarbList",
            feIds: feUser.get.childFeIds("userVarbListMain"),
            addList: () => feUser.addChild("userVarbListMain"),
            makeListNode: (nodeProps) => <VarbListUserVarbs {...nodeProps} />,
          }}
        />
      </MainSectionBody>
    </MainSection>
  );
}
