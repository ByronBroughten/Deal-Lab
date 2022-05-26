import React from "react";
import { BiReset } from "react-icons/bi";
import { MdSystemUpdateAlt } from "react-icons/md";
import styled from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { auth } from "../../../../modules/services/authService";
import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import { useRowIndexSourceActions } from "../../../../modules/useRowIndexSourceActions";
import { FeInfoByType } from "../../../../sharedWithServer/SectionsMeta/Info";
import theme from "../../../../theme/Theme";
import BtnTooltip from "../../BtnTooltip";
import { IconBtn } from "../../IconBtn";
import RowIndexSectionList from "../../RowIndexSectionList";
import XBtn from "../../Xbtn";
import MainSectionTitleRowTitle from "./MainSectionTitleRowTitle.tsx/MainSectionTitleRowTitle";
import MainSectionTitleSaveBtn from "./MainSectionTitleRowTitle.tsx/MainSectionTitleSaveBtn";

type Props = {
  info: FeInfoByType<"hasRowIndex">;
  pluralName: string;
  xBtn?: boolean;
  droptop?: boolean;
};
export function MainSectionTitleRowNext({
  // Table Entry Title Row
  info,
  pluralName,
  xBtn = false,
  droptop = false,
}: Props) {
  const { handleRemoveSection, handleSet } = useAnalyzerContext();
  const { update, isIndexSaved } = useRowIndexSourceActions(info);

  const { btnMenuIsOpen, toggleBtnMenu } = useToggleView({
    initValue: false,
    viewWhat: "btnMenu",
  });

  const isGuest = !auth.isLoggedIn;

  const feInfo = {
    sectionName: info.sectionName,
    id: info.feId,
    idType: "feId",
  } as const;

  return (
    <MainEntryTitleRowStyled
      className="MainSectionTitleRow-root"
      btnMenuIsOpen={btnMenuIsOpen}
    >
      <div className="MainSectionTitleRow-leftSide">
        <MainSectionTitleRowTitle feInfo={feInfo} />
        <div className="MainSectionTitleRow-leftSide-btnsRow">
          {
            <>
              <BtnTooltip title="New">
                <IconBtn
                  className="MainSectionTitleRow-flexUnit"
                  onClick={async () =>
                    handleSet("loadSectionFromFeDefault", feInfo as any)
                  }
                >
                  <BiReset />
                </IconBtn>
              </BtnTooltip>
              <MainSectionTitleSaveBtn feInfo={feInfo} />
              {isIndexSaved && (
                <BtnTooltip
                  title="Save updates"
                  className="MainSectionTitleRow-flexUnit"
                >
                  <IconBtn onClick={update}>
                    <MdSystemUpdateAlt />
                  </IconBtn>
                </BtnTooltip>
              )}
              <RowIndexSectionList
                {...{
                  className: "MainSectionTitleRow-flexUnit",
                  feInfo,
                  pluralName,
                  disabled: isGuest,
                  droptop,
                }}
              />
            </>
          }
        </div>
      </div>
      {xBtn && <XBtn onClick={() => handleRemoveSection(feInfo)} />}
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