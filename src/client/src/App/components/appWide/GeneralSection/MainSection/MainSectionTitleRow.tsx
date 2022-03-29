import React from "react";
import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import BigStringEditor from "../../../inputs/BigStringEditor";
import SectionBtn from "../../SectionBtn";
import XBtn from "../../Xbtn";
import IndexSectionList from "../../IndexSectionList";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { auth } from "../../../../modules/services/authService";
import { useStores } from "../../../../modules/customHooks/useStore";
import {
  FeInfo,
  Inf,
} from "../../../../sharedWithServer/Analyzer/SectionMetas/Info";
import { IconBtn } from "../../IconBtn";
import { BiPlusCircle, BiReset } from "react-icons/bi";
import BtnTooltip from "../../BtnTooltip";
import { AiOutlineSave } from "react-icons/ai";
import { LoggedInOrOutIconBtn } from "../../LoggedInOrNotBtn";
import { MdSystemUpdateAlt } from "react-icons/md";
import { IoCopyOutline } from "react-icons/io5";

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
      className="MainSectionTitleRow-root"
      btnMenuIsOpen={btnMenuIsOpen}
    >
      <div className="MainSectionTitleRow-leftSide">
        <BigStringEditor
          {...{
            feVarbInfo: Inf.feVarb("title", feInfo),
            label: "Title",
            className: "MainSectionTitleRow-title",
          }}
        />
        <div className="MainSectionTitleRow-leftSide-btnsRow">
          {/* <PlainIconBtn
            onClick={toggleBtnMenu}
            className="MainSectionTitleRow-ellipsisBtn MainSectionTitleRow-flexUnit"
          >
            <IoEllipsisHorizontal size="25" />
          </PlainIconBtn> */}
          {
            <>
              <BtnTooltip title="New">
                <IconBtn
                  className="MainSectionTitleRow-flexUnit"
                  onClick={async () =>
                    handleSet("loadSectionFromFeDefault", feInfo)
                  }
                >
                  <BiReset />
                </IconBtn>
              </BtnTooltip>

              {/* reset (circular arrows), new (+), save (floppy), load (up arrow or something) */}
              {!isSaved && (
                <LoggedInOrOutIconBtn
                  {...{
                    shared: {
                      btnProps: {
                        children: <AiOutlineSave />,
                      },
                      tooltipProps: {
                        className: "MainSectionTitleRow-flexUnit",
                      },
                    },
                    loggedIn: {
                      btnProps: {
                        onClick: async () =>
                          await store.postRowIndexEntry(feInfo),
                      },
                      tooltipProps: {
                        title: "Save",
                      },
                    },
                    loggedOut: {
                      btnProps: {
                        disabled: true,
                      },
                      tooltipProps: {
                        title: "Login to save",
                      },
                    },
                  }}
                />
              )}
              {isSaved && (
                <>
                  <BtnTooltip
                    title="Save updates"
                    className="MainSectionTitleRow-flexUnit"
                  >
                    <IconBtn
                      onClick={async () => await store.putRowIndexEntry(feInfo)}
                    >
                      <MdSystemUpdateAlt />
                    </IconBtn>
                  </BtnTooltip>
                  <BtnTooltip
                    title="Save updates"
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
