import React from "react";
import { AiOutlineSave } from "react-icons/ai";
import { VscDiscard } from "react-icons/vsc";
import styled from "styled-components";
import { SnFeUserChildNames } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/FeStoreName";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { SetterSections } from "../../sharedWithServer/StateSetters/SetterSections";
import { nativeTheme } from "../../theme/nativeTheme";
import { ChangesSyncedStatusBtn } from "../appWide/GeneralSection/MainSection/ChangesSyncedStatusBtn";
import { StyledActionBtn } from "../appWide/GeneralSection/MainSection/StoreSectionActionMenu/ActionBtns.tsx/StyledActionBtn";
import { SectionTitle } from "../appWide/SectionTitle";
import { Row } from "../general/Row";
import theme from "./../../theme/Theme";
import { useSaveEditorToDb } from "./useSaveEditorToDb";

type Props<SN extends SectionName> = {
  titleText: React.ReactNode;
  sectionName: SN;
  childNames: SnFeUserChildNames<SN>[];
  onSave?: (setterSections: SetterSections) => void;
};
export function UserEditorTitleRow<SN extends SectionName>({
  titleText,
  sectionName,
  childNames,
  onSave,
}: Props<SN>) {
  const { saveChanges, discardChanges, areSaved } = useSaveEditorToDb(
    sectionName,
    childNames,
    onSave
  );
  const saveStatus = areSaved ? "changesSynced" : "unsyncedChanges";
  return (
    <Styled className="UserEdiotorTitleRow-root">
      <Row style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
        <SectionTitle sx={{ marginRight: nativeTheme.s4 }} text={titleText} />
        <ChangesSyncedStatusBtn {...{ saveStatus }} />
      </Row>
      <Row style={{ marginTop: nativeTheme.s35 }}>
        <StyledActionBtn
          {...{
            disabled: areSaved,
            left: <AiOutlineSave size={25} />,
            middle: "Save and Apply Changes",
            onClick: saveChanges,
          }}
        />
        <StyledActionBtn
          {...{
            sx: { marginLeft: nativeTheme.s2 },
            disabled: areSaved,
            left: <VscDiscard size={22} />,
            middle: "Discard Changes",
            onClick: discardChanges,
          }}
        />
      </Row>
    </Styled>
  );
}

const Styled = styled.div`
  padding-bottom: ${theme.s3};
  .UserListMainSection-sectionBtns {
    padding-top: ${theme.s2};
  }
  .UserListMainSection-infoBlurb {
    margin-top: ${theme.s3};
    margin-bottom: ${theme.s2};
  }
  .UserListMainSection-btnsRow {
    display: flex;
    align-items: center;
    .ListMenuBtn-root {
      height: 33px;
      margin: 0 ${theme.s2};
    }
  }
`;
