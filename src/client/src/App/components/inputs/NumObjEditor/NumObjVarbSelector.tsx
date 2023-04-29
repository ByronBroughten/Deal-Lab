import { EditorState } from "draft-js";
import React from "react";
import styled from "styled-components";
import { useToggleView } from "../../../modules/customHooks/useToggleView";
import { FeSectionInfo } from "../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { mixedInfoS } from "../../../sharedWithServer/SectionsMeta/SectionInfo/MixedSectionInfo";
import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import { ValueFixedVarbPathName } from "../../../sharedWithServer/StateEntityGetters/ValueInEntityInfo";
import { nativeTheme } from "../../../theme/nativeTheme";
import theme from "../../../theme/Theme";
import { HollowBtn } from "../../appWide/HollowBtn";
import { DropdownContainer } from "../../general/DropdownContainer";
import { InfoModal } from "../../general/InfoModal";
import { icons } from "../../Icons";
import { PopperRef } from "../VarbAutoComplete";
import { AllVarbsModal } from "./AllVarbsModal";
import { insertVarbEntity } from "./NumObjVarbSelector/insertVarbEntity";
import {
  OnVarbSelect,
  VarbSelectorCollection,
} from "./NumObjVarbSelector/VarbSelectorCollection";
import { VarbSelectorRow } from "./NumObjVarbSelector/VarbSelectorRow";
import { VarbSelectorShell } from "./NumObjVarbSelector/VarbSelectorShell";

interface Props extends FeSectionInfo {
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  varbPathNames?: ValueFixedVarbPathName[];
}

export const NumObjVarbSelector = React.memo(
  React.forwardRef(
    (
      {
        setEditorState,
        varbPathNames = ["purchasePrice", "numUnits"],
        ...feInfo
      }: Props,
      ref: PopperRef
    ) => {
      const { toggleVarbs, varbsIsOpen, closeVarbs } = useToggleView("varbs");
      const { openInfo, infoIsOpen, closeInfo } = useToggleView("info");
      const { openAllVarbs, allVarbsIsOpen, closeAllVarbs } =
        useToggleView("allVarbs");

      const focalSection = useGetterSection(feInfo);
      const onVarbSelect: OnVarbSelect = (varbInfo) => {
        const { displayNameFull } = focalSection.varbByFocalMixed(varbInfo);
        insertVarbEntity({
          setEditorState,
          displayName: displayNameFull,
          varbInfo,
        });
      };
      return (
        <Styled ref={ref} className="NumObjVarbSelector-root">
          <div className="NumObjVarbSelector-absolute">
            <div className="NumObjVarbSelector-wrapper">
              <div className="NumObjVarbSelector-BtnDiv">
                <AddVarbBtn
                  {...{ middle: "+ Variable", onClick: toggleVarbs }}
                />
                <HollowBtn
                  className="NumObjVarbSelector-infoBtn"
                  middle={icons.info({ size: 21 })}
                  onClick={openInfo}
                  sx={{
                    borderRadius: 0,
                    border: "none",
                    color: nativeTheme.complementary.main,
                    padding: nativeTheme.s2,
                    borderLeft: `1px solid ${nativeTheme.complementary.light}`,
                    height: selectorHeight,
                    "&:hover": {
                      backgroundColor: nativeTheme.complementary.light,
                    },
                  }}
                />
                <InfoModal
                  {...{
                    showModal: infoIsOpen,
                    closeModal: closeInfo,
                    title: "Equation Editor and Variables",
                    infoText: `This input is an Equation Editor. It lets you enter numbers as well as symbols to add (+), subtract (-), multiply (*) and divide (/).\n\nAdditionally, you may also enter variables. This lets the input respond to other inputs, much excel spreadsheet cells with formulas.\n\nTo add a variable, simply click the "+ Variable" button and choose one from the dropdown that appears.`,
                  }}
                />
              </div>
              {varbsIsOpen && (
                <DropdownContainer
                  {...{
                    closeDropdown: closeVarbs,
                    AbsoluteProps: { style: { top: 1, left: -1 } },
                  }}
                >
                  <VarbSelectorShell>
                    <VarbSelectorCollection
                      {...{
                        focalInfo: feInfo,
                        onVarbSelect,
                        rowInfos: varbPathNames.map((varbPathName) =>
                          mixedInfoS.varbPathName(varbPathName)
                        ),
                      }}
                    />
                    <ViewAllRow
                      {...{
                        onClick: openAllVarbs,
                        displayName: "View All",
                        className: "NumObjVarbSelector-viewAll",
                      }}
                    />
                  </VarbSelectorShell>
                  <AllVarbsModal
                    {...{
                      focalInfo: feInfo,
                      onVarbSelect,
                      closeAllVarbs,
                      allVarbsIsOpen,
                    }}
                  />
                </DropdownContainer>
              )}
            </div>
          </div>
        </Styled>
      );
    }
  )
);

const selectorHeight = "30px";

const AddVarbBtn = styled(HollowBtn)`
  height: ${selectorHeight};
  width: 98px;
  padding: ${theme.s25};
  border-radius: 0;
  border: none;
  color: ${theme.primary.main};
  :hover {
    background-color: ${theme.primary.light};
  }
`;

const ViewAllRow = styled(VarbSelectorRow)`
  background-color: ${theme.light};
  .VarbSelectorRow-Btn {
    color: ${theme.primary.main};
    justify-content: center;
    padding: 0;
    :hover {
      color: ${theme.light};
      background-color: ${theme.primary.main};
    }
  }
`;

const Styled = styled.div`
  position: relative;

  .NumObjVarbSelector-BtnDiv {
    border-top: 1px solid ${theme.primary.light};
    display: flex;
    align-items: center;
    background: ${theme.light};
  }

  .VarbAutoComplete-root {
    .MuiInputBase-root {
      margin-top: ${theme.s1};
    }
  }

  .NumObjVarbSelector-absolute {
    position: absolute;
    z-index: 4;
    display: flex;
  }
  .NumObjVarbSelector-wrapper {
    border: 2px solid;
    border-top: 0px solid;
    border-left: 1px solid;
    border-color: ${theme.next.dark};
    border-top-left-radius: 0;
  }
`;
