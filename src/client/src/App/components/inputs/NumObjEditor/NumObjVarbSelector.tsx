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
import { icons } from "../../Icons";
import { useInfoModal } from "../../Modals/InfoModalProvider";
import { useDealModeContextVarbSelect } from "../../Modals/VarbSelectModalProvider";
import { insertVarbEntity } from "./NumObjVarbSelector/insertVarbEntity";
import {
  OnVarbSelect,
  VarbSelectorCollection,
} from "./NumObjVarbSelector/VarbSelectorCollection";
import { VarbSelectorRow } from "./NumObjVarbSelector/VarbSelectorRow";
import { VarbSelectorShell } from "./NumObjVarbSelector/VarbSelectorShell";

export type PopperRef = React.Ref<HTMLDivElement>;

interface Props extends FeSectionInfo {
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  varbPathNames?: ValueFixedVarbPathName[];
}

export const NumObjVarbSelector = React.memo(
  React.forwardRef(
    (
      {
        setEditorState,
        varbPathNames = ["purchasePrice", "numUnits", "sqft"],
        ...feInfo
      }: Props,
      ref: PopperRef
    ) => {
      const { toggleVarbs, varbsIsOpen, closeVarbs } = useToggleView("varbs");

      const focalSection = useGetterSection(feInfo);
      const onVarbSelect: OnVarbSelect = (varbInfo) => {
        const { variableLabel } = focalSection.varbByFocalMixed(varbInfo);
        insertVarbEntity({
          setEditorState,
          displayName: variableLabel,
          varbInfo,
        });
      };

      const openVarbSelect = useDealModeContextVarbSelect(onVarbSelect);

      const { setModal } = useInfoModal();
      const openModal = () =>
        setModal({
          title: "Equation Editor and Variables",
          infoText: `This input is a Variable Editor. Like all the other numeric editors, it lets you enter numbers as well as symbols, to add, subtract, multiply, and divide (+,-,*,/).\n\nAdditionally, you may enter variables. This lets you plug in the values of other inputs, much like excel spreadsheet formulas.\n\nTo add a variable, simply click the "+ Variables" button and choose one from the dropdown.`,
        });

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
                  onClick={openModal}
                  sx={{
                    borderRadius: 0,
                    border: "none",
                    color: nativeTheme.darkBlue.main,
                    padding: nativeTheme.s2,
                    borderLeft: `1px solid ${nativeTheme.darkBlue.light}`,
                    height: selectorHeight,
                    "&:hover": {
                      backgroundColor: nativeTheme.darkBlue.light,
                    },
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
                        onClick: openVarbSelect,
                        displayName: "View All",
                        className: "NumObjVarbSelector-viewAll",
                      }}
                    />
                  </VarbSelectorShell>
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
  color: ${nativeTheme.darkBlue.main};
  :hover {
    background-color: ${nativeTheme.darkBlue.main};
  }
`;

const ViewAllRow = styled(VarbSelectorRow)`
  background-color: ${theme.light};
  .VarbSelectorRow-Btn {
    color: ${nativeTheme.darkBlue.main};
    justify-content: center;
    padding: 0;
    :hover {
      color: ${theme.light};
      background-color: ${nativeTheme.darkBlue.main};
    }
  }
`;

const Styled = styled.div`
  position: relative;

  .NumObjVarbSelector-BtnDiv {
    border-top: 1px solid ${nativeTheme.darkBlue.light};
    display: flex;
    align-items: center;
    background: ${theme.light};
  }

  .NumObjVarbSelector-absolute {
    position: absolute;
    z-index: 4;
    display: flex;
  }
  .NumObjVarbSelector-wrapper {
    border: 2px solid;
    border-color: ${nativeTheme.darkBlue.main};
    border-top: 0px;
    border-left: 1px solid;
    border-top-left-radius: 0;
  }
`;
