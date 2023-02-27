import React from "react";
import { AiOutlineSave } from "react-icons/ai";
import { VscDiscard } from "react-icons/vsc";
import styled from "styled-components";
import { SnFeUserChildNames } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/FeStoreName";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useAuthStatus } from "../../sharedWithServer/stateClassHooks/useAuthStatus";
import { BackToSectionBtn } from "../ActiveDealPage/ActiveDeal/BackToSectionBtn";
import { ExclaimBlurb } from "../appWide/ExclaimBlurb";
import { SectionTitleRow } from "../appWide/GeneralSection/MainSection/SectionTitleRow";
import { StyledActionBtn } from "../appWide/GeneralSection/MainSection/StoreSectionActionMenu/ActionBtns.tsx/StyledActionBtn";
import { SectionTitle } from "../appWide/SectionTitle";
import theme from "./../../theme/Theme";
import { useSaveEditorToDb } from "./useSaveEditorToDb";

type Props<SN extends SectionName> = {
  titleText: React.ReactNode;
  sectionName: SN;
  childNames: SnFeUserChildNames<SN>[];
  goBack?: () => void;
};
export function UserEditorTitleRow<SN extends SectionName>({
  titleText,
  sectionName,
  childNames,
  goBack,
}: Props<SN>) {
  const authStatus = useAuthStatus();
  const { saveChanges, discardChanges, areSaved } = useSaveEditorToDb(
    sectionName,
    childNames
  );
  return (
    <Styled className="UserEditorTitleRow-root">
      <SectionTitleRow
        {...{
          className: "UserListMainSection-sectionTitle",
          leftSide: (
            <SectionTitle
              className="UserEditorTitleRow-sectionTitle"
              text={titleText}
            />
          ),
          ...(goBack && {
            rightSide: (
              <BackToSectionBtn backToWhat="Lists Menu" onClick={goBack} />
            ),
          }),
        }}
      />
      <SectionTitleRow
        className="UserListMainSection-sectionBtns"
        leftSide={
          <div className="UserListMainSection-btnsRow">
            <StyledActionBtn
              {...{
                className: "UserListMainSection-saveBtn",
                disabled: authStatus === "guest" || areSaved,
                isDisabled: authStatus === "guest" || areSaved,
                left: <AiOutlineSave size={25} />,
                middle: "Save and Apply Changes",
                onClick: saveChanges,
              }}
            />
            <StyledActionBtn
              {...{
                className: "UserListMainSection-discardChanges",
                disabled: areSaved,
                isDisabled: areSaved,
                left: <VscDiscard size={22} />,
                middle: "Discard Changes",
                onClick: discardChanges,
              }}
            />
          </div>
        }
      />
      {authStatus === "guest" && (
        <ExclaimBlurb className="UserListMainSection-infoBlurb">
          Log in to save and apply changes.
        </ExclaimBlurb>
      )}
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
  .UserListMainSection-discardChanges {
    margin-left: ${theme.s2};
  }
  .UserListMainSection-saveBtn {
    /* width: 250px; */
  }

  .UserEditorTitleRow-sectionTitle {
    margin-right: ${theme.s2};
  }
`;
