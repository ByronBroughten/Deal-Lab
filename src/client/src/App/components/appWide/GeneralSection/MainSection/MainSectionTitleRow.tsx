import React from "react";
import styled, { css } from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useAuthStatus } from "../../../../sharedWithServer/stateClassHooks/useAuthStatus";
import theme from "../../../../theme/Theme";
import { RemoveSectionXBtn } from "../../RemoveSectionXBtn";
import { MainSectionMenus } from "./MainSectionTitleRow/MainSectionMenus";
import { MainSectionTitleRowTitle } from "./MainSectionTitleRow/MainSectionTitleRowTitle";

type Props = {
  sectionName: SectionNameByType<"hasCompareTable">;
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
  const authStatus = useAuthStatus();
  const { btnMenuIsOpen } = useToggleView({
    initValue: false,
    viewWhat: "btnMenu",
  });
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
        <div className="MainSectionTitleRow-leftSide-btnsRow">
          <MainSectionMenus
            {...{
              ...feInfo,
              pluralName,
              xBtn,
              dropTop,
            }}
          />
        </div>
      </div>
      <div className="MainSectionTitleRow-rightSide">
        {xBtn && (
          <RemoveSectionXBtn className="MainSectionTitleRow-xBtn" {...feInfo} />
        )}
      </div>
    </Styled>
  );
}

// <Link className="GeneralSectionTitle-dealsLink" to="/deals">
//   <MainSectionTitleBtn
//     themeName="deal"
//     className="GeneralSectionTitle-child"
//     // disabled={!auth.isToken}
//   >
//     {"Compare Deals"}
//     <MdCompareArrows className="GeneralSectionTitle-compareIcon" />
//   </MainSectionTitleBtn>
// </Link>

const Styled = styled.div<{ $btnMenuIsOpen: boolean; $dropTop: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .LabeledIconBtn-root {
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

  .MainSectionTitleRow-leftSide {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .MainSectionTitleRow-rightSide {
    display: flex;
  }
  .MainSectionTitleRow-title ..DraftTextField-root {
    min-width: 150px;
  }
  .MainSectionTitleRow-title,
  .MainSectionTitleRow-leftSide-btnsRow {
    margin: 0 ${theme.s2};
  }

  .MainSectionTitleRow-xBtn {
    margin-left: ${theme.s3};
    height: ${theme.bigButtonHeight};
    width: ${theme.bigButtonHeight};
  }
`;
