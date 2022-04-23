import React from "react";
import { BiReset } from "react-icons/bi";
import { IoCopyOutline } from "react-icons/io5";
import { MdSystemUpdateAlt } from "react-icons/md";
import styled from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { auth } from "../../../../modules/services/authService";
import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import { useSectionQueryActions } from "../../../../modules/useQueryActions/useSectionQueryActions";
import {
  FeInfo,
  Inf,
} from "../../../../sharedWithServer/Analyzer/SectionMetas/Info";
import theme from "../../../../theme/Theme";
import BtnTooltip from "../../BtnTooltip";
import { IconBtn } from "../../IconBtn";
import IndexSectionList from "../../IndexSectionList";
import XBtn from "../../Xbtn";
import MainSectionTitleRowTitle from "./MainSectionTitleRowTitle.tsx/MainSectionTitleRowTitle";
import MainSectionTitleSaveBtn from "./MainSectionTitleRowTitle.tsx/MainSectionTitleSaveBtn";

type Props = {
  feInfo: FeInfo<"hasRowIndexStore">;
  pluralName: string;
  xBtn?: boolean;
  droptop?: boolean;
};
export default function MainSectionTitleRow({
  // Table Entry Title Row
  feInfo,
  pluralName,
  xBtn = false,
  droptop = false,
}: Props) {
  const { analyzer, handleRemoveSection, handleSet } = useAnalyzerContext();
  const store = useSectionQueryActions();

  const { btnMenuIsOpen, toggleBtnMenu } = useToggleView({
    initValue: false,
    viewWhat: "btnMenu",
  });

  const { dbId, indexStoreName } = analyzer.section(feInfo);
  const isSaved = analyzer.hasSection(Inf.db(indexStoreName, dbId));
  const isGuest = !auth.isLoggedIn;

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

              {/* reset (circular arrows), new (+), save (floppy), load (up arrow or something) */}
              {!isSaved && <MainSectionTitleSaveBtn feInfo={feInfo} />}
              {isSaved && (
                <>
                  <BtnTooltip
                    title="Save updates"
                    className="MainSectionTitleRow-flexUnit"
                  >
                    <IconBtn
                      onClick={async () =>
                        await store.updateRowIndexSection(feInfo)
                      }
                    >
                      <MdSystemUpdateAlt />
                    </IconBtn>
                  </BtnTooltip>
                  <BtnTooltip
                    title="Copy"
                    className="MainSectionTitleRow-flexUnit"
                  >
                    <IconBtn onClick={() => handleSet("copySection", feInfo)}>
                      <IoCopyOutline />
                    </IconBtn>
                  </BtnTooltip>
                </>
              )}
              <IndexSectionList
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
