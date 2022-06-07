import React from "react";
import { BiReset } from "react-icons/bi";
import styled from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { auth } from "../../../../modules/services/authService";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../theme/Theme";
import BtnTooltip from "../../BtnTooltip";
import { IconBtn } from "../../IconBtn";
import XBtn from "../../Xbtn";
import { MainSectionTitleRowTitleNext } from "./MainSectionTitleRow/MainSectionTitleRowTitle";
import MainSectionTitleSaveBtn from "./MainSectionTitleRow/MainSectionTitleSaveBtn";

type Props = {
  feInfo: FeInfoByType<"hasRowIndex">;
  pluralName: string;
  xBtn?: boolean;
  droptop?: boolean;
};
export function MainSectionTitleRow({
  // Table Entry Title Row
  feInfo,
  pluralName,
  xBtn = false,
  droptop = false,
}: Props) {
  const section = useSetterSection(feInfo);
  // const { update, isIndexSaved } = useRowIndexSourceActions(feInfo);
  const { btnMenuIsOpen, toggleBtnMenu } = useToggleView({
    initValue: false,
    viewWhat: "btnMenu",
  });
  const isGuest = !auth.isLoggedIn;
  return (
    <MainEntryTitleRowStyled
      className="MainSectionTitleRow-root"
      btnMenuIsOpen={btnMenuIsOpen}
    >
      <div className="MainSectionTitleRow-leftSide">
        <MainSectionTitleRowTitleNext feInfo={feInfo} />
        <div className="MainSectionTitleRow-leftSide-btnsRow">
          {
            <>
              <BtnTooltip title="New">
                <IconBtn
                  className="MainSectionTitleRow-flexUnit"
                  onClick={async () => section.resetSelf()}
                >
                  <BiReset />
                </IconBtn>
              </BtnTooltip>
              <MainSectionTitleSaveBtn feInfo={feInfo} />
              {/* {isIndexSaved && (
                <BtnTooltip
                  title="Save updates"
                  className="MainSectionTitleRow-flexUnit"
                >
                  <IconBtn onClick={update}>
                    <MdSystemUpdateAlt />
                  </IconBtn>
                </BtnTooltip>
              )} */}
              {/* <RowIndexSectionList
              This will be switched to some version of the IndexTable
                {...{
                  className: "MainSectionTitleRow-flexUnit",
                  feInfo,
                  pluralName,
                  disabled: isGuest,
                  droptop,
                }}
              /> */}
            </>
          }
        </div>
      </div>
      {xBtn && <XBtn onClick={() => section.removeSelf()} />}
    </MainEntryTitleRowStyled>
  );
}

export const MainEntryTitleRowStyled = styled.div<{ btnMenuIsOpen: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .MainSectionTitleRow-ellipsisBtn {
    color: ${({ btnMenuIsOpen }) =>
      btnMenuIsOpen ? theme["gray-600"] : theme.dark};
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
    height: ${theme.bigButtonHeight};
    width: ${theme.bigButtonHeight};
  }
`;
