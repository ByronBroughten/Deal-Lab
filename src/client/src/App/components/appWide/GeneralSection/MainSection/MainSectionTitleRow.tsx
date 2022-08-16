import React from "react";
import { AiOutlineSave } from "react-icons/ai";
import { BiCopy, BiReset } from "react-icons/bi";
import { MdDelete, MdOutlineSystemUpdateAlt } from "react-icons/md";
import styled, { css } from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { HasRowFeStore } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { useAuthStatus } from "../../../../sharedWithServer/stateClassHooks/useAuthStatus";
import theme from "../../../../theme/Theme";
import { DropdownList } from "../../DropdownList";
import { LabeledIconBtn } from "../../LabeledIconBtn";
import RowIndexSectionList from "../../RowIndexSectionList";
import XBtn from "../../Xbtn";
import { MainSectionTitleRowTitle } from "./MainSectionTitleRow/MainSectionTitleRowTitle";

type Props = {
  sectionName: HasRowFeStore;
  feId: string;
  pluralName: string;
  xBtn?: boolean;
  dropTop?: boolean;
};
export function MainSectionTitleRow({
  pluralName,
  xBtn = false,
  dropTop = false,
  ...feInfo
}: Props) {
  const mainSection = useMainSectionActor(feInfo);
  const authStatus = useAuthStatus();

  const { btnMenuIsOpen, toggleBtnMenu } = useToggleView({
    initValue: false,
    viewWhat: "btnMenu",
  });
  const { displayName } = mainSection.get.meta;
  const isGuest = authStatus === "guest";
  return (
    <Styled
      className="MainSectionTitleRow-root"
      {...{
        $btnMenuIsOpen: btnMenuIsOpen,
        $dropTop: dropTop,
      }}
    >
      <div className="MainSectionTitleRow-leftSide">
        <MainSectionTitleRowTitle feInfo={feInfo} />
        <DropdownList
          {...{
            className: "MainsectionTitleRow-dropdownList",
            title: `Actions`,
            dropTop,
          }}
        >
          {!mainSection.isSaved && (
            <LabeledIconBtn
              label={isGuest ? "Sign in to Save" : "Save"}
              disabled={isGuest}
              icon={<AiOutlineSave size="25" />}
              onClick={() => mainSection.saveNew()}
            />
          )}
          {mainSection.isSaved && (
            <>
              <LabeledIconBtn
                label="Save updates"
                icon={<MdOutlineSystemUpdateAlt size="25" />}
                onClick={() => mainSection.saveUpdates()}
              />
              <LabeledIconBtn
                label="Save as new"
                icon={<AiOutlineSave size="25" />}
                onClick={() => mainSection.saveAsNew()}
              />
              <LabeledIconBtn
                label="Make a copy"
                icon={<BiCopy size="28" />}
                onClick={() => mainSection.makeACopy()}
              />
              <LabeledIconBtn
                label="Copy and save"
                icon={
                  <span style={{ display: "flex" }}>
                    <BiCopy size="23" />
                    <AiOutlineSave size="21" />
                  </span>
                }
                onClick={() => mainSection.copyAndSave()}
              />
              <LabeledIconBtn
                label="Delete from saved"
                icon={<MdDelete size="24" />}
                onClick={() => mainSection.deleteSelf()}
              />
            </>
          )}
          <LabeledIconBtn
            label="Create new"
            icon={<BiReset size="26" />}
            onClick={() => mainSection.replaceWithDefault()}
          />
        </DropdownList>
        <div className="MainSectionTitleRow-leftSide-btnsRow">
          {
            <RowIndexSectionList
              {...{
                className: "MainSectionTitleRow-flexUnit",
                feInfo,
                pluralName,
                disabled: isGuest,
                dropTop,
              }}
            />
          }
        </div>
      </div>
      <div className="MainSectionTitleRow-rightSide">
        {xBtn && <XBtn onClick={() => mainSection.removeSelf()} />}
      </div>
    </Styled>
  );
}

const Styled = styled.div<{ $btnMenuIsOpen: boolean; $dropTop: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .LabeledIconBtn-root {
    width: 230px;
    height: 30px;
    border-top: 1px solid ${theme["gray-500"]};
    :first-child {
      ${({ $dropTop }) =>
        !$dropTop &&
        css`
          border-top: none;
        `}
    }
  }

  .MainSectionTitleRow-ellipsisBtn {
    color: ${({ $btnMenuIsOpen }) =>
      $btnMenuIsOpen ? theme["gray-600"] : theme.dark};
  }
  .MainsectionTitleRow-dropdownList {
    margin-left: ${theme.s2};
  }

  .MainSectionTitleRow-rightSide {
    display: flex;
  }

  .MainSectionTitleRow-leftSide {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .MainSectionTitleRow-title,
  .MainSectionTitleRow-leftSide-btnsRow {
    // these need this in order to flex properly
    margin: 0 ${theme.s2};
  }

  .MainSectionTitleRow-title ..DraftTextField-root {
    min-width: 150px;
  }

  .MainSectionTitleRow-leftSide-btnsRow {
    display: flex;
    .MainSectionTitleRow-flexUnit {
      :not(:first-child) {
        margin-left: ${theme.s2};
      }
    }
  }

  .XBtn {
    margin-left: ${theme.s3};
    height: ${theme.bigButtonHeight};
    width: ${theme.bigButtonHeight};
  }
`;
