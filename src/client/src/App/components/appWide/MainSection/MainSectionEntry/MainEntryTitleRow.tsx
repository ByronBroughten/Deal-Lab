import React from "react";
import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import BigStringEditor from "../../../inputs/BigStringEditor";
import SectionBtn from "../../SectionBtn";
import XBtn from "../../Xbtn";
import IndexSectionList from "../../IndexSectionList";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { IoEllipsisHorizontal } from "react-icons/io5";
import PlainIconBtn from "../../../general/PlainIconBtn";
import { auth } from "../../../../modules/services/authService";
import { useStores } from "../../../../modules/customHooks/useStore";
import {
  FeInfo,
  Inf,
} from "../../../../sharedWithServer/Analyzer/SectionMetas/Info";
import LoginToAccessBtnTooltip from "../../LoginToAccessBtnTooltip";

type Props = {
  feInfo: FeInfo<"hasRowIndexStore">;
  pluralName: string;
  xBtn?: boolean;
  droptop?: boolean;
  hideLoad?: boolean;
};
export default function MainEntryTitleRow({
  // Table Entry Title Row
  feInfo,
  pluralName,
  xBtn = false,
  droptop = false,
  hideLoad = false,
}: Props) {
  const { analyzer, handleRemoveSection, handle } = useAnalyzerContext();
  const store = useStores();

  const { btnMenuIsOpen, toggleBtnMenu } = useToggleView({
    initValue: false,
    viewWhat: "btnMenu",
  });

  const { dbId, indexStoreName } = analyzer.section(feInfo);
  const isSaved = analyzer.hasSection(Inf.db(indexStoreName, dbId));
  const isGuest = !auth.isLoggedIn;
  //

  return (
    <MainEntryTitleRowStyled
      className="MainEntryTitleRow-root"
      btnMenuIsOpen={btnMenuIsOpen}
    >
      <div className="MainEntryTitleRow-leftSide">
        <BigStringEditor
          {...{
            feVarbInfo: Inf.feVarb("title", feInfo),
            label: "Title",
            className: "MainEntryTitleRow-title",
          }}
        />
        <div className="MainEntryTitleRow-leftSide-btnsRow">
          {/* <PlainIconBtn
            onClick={toggleBtnMenu}
            className="MainEntryTitleRow-ellipsisBtn MainEntryTitleRow-flexUnit"
          >
            <IoEllipsisHorizontal size="25" />
          </PlainIconBtn> */}
          {true && (
            <>
              <SectionBtn
                className="MainEntryTitleRow-flexUnit"
                onClick={async () => handle("loadSectionFromFeDefault", feInfo)}
              >
                New
              </SectionBtn>
              {!isSaved && (
                <LoginToAccessBtnTooltip className="MainEntryTitleRow-flexUnit">
                  <SectionBtn
                    className="MainEntryTitleRow-flexUnit"
                    onClick={async () => await store.postRowIndexEntry(feInfo)}
                    disabled={isGuest}
                  >
                    Save
                  </SectionBtn>
                </LoginToAccessBtnTooltip>
              )}
              {isSaved && (
                <>
                  <SectionBtn
                    className="MainEntryTitleRow-flexUnit"
                    onClick={async () => await store.putRowIndexEntry(feInfo)}
                    disabled={isGuest}
                  >
                    Save Updates
                  </SectionBtn>
                  <SectionBtn
                    className="MainEntryTitleRow-flexUnit"
                    onClick={() => handle("copySection", feInfo)}
                  >
                    Copy
                  </SectionBtn>
                </>
              )}
              {/* <LoginToAccessBtnTooltip className="MainEntryTitleRow-flexUnit">
                <SectionBtn
                  onClick={async () => await store.postDefault(feInfo)}
                  disabled={isGuest}
                >
                  Set as default
                </SectionBtn>
              </LoginToAccessBtnTooltip> */}
              <IndexSectionList
                {...{
                  className: "MainEntryTitleRow-flexUnit",
                  feInfo,
                  pluralName,
                  disabled: isGuest || hideLoad,
                  droptop,
                }}
              />
            </>
          )}
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

  .MainEntryTitleRow-ellipsisBtn {
    color: ${({ btnMenuIsOpen }) =>
      btnMenuIsOpen ? theme["gray-600"] : theme.dark};
  }

  .MainEntryTitleRow-leftSide {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .MainEntryTitleRow-title,
  .MainEntryTitleRow-leftSide-btnsRow {
    // these need this in order to flex properly
    margin: 0 ${theme.s2};
  }

  .MainEntryTitleRow-title ..DraftTextField-root {
    min-width: 150px;
  }

  .MainEntryTitleRow-leftSide-btnsRow {
    display: flex;
    .MainEntryTitleRow-flexUnit {
      :not(:first-child) {
        margin-left: ${theme.s2};
      }
    }
  }

  .XBtn {
    height: ${theme.bigButtonHeight};
    width: ${theme.bigButtonHeight};
    margin: ${theme.s2};
  }
`;
