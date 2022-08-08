import { rem } from "polished";
import React from "react";
import styled, { css } from "styled-components";
import { FeParentInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { Arr } from "../../../../sharedWithServer/utils/Arr";
import ccs from "../../../../theme/cssChunks";
import theme from "../../../../theme/Theme";
import useHowMany from "../../../appWide/customHooks/useHowMany";
import PlusBtn from "../../../appWide/PlusBtn";
import { useOpenWidth } from "../../../appWide/SectionTitleRow";
import { UnitItemNext } from "./UnitList/UnitItem";

type Props = { feInfo: FeParentInfo<"unit">; className?: string };
export function UnitList({ feInfo, className }: Props) {
  const numUnitsPerRow = 2;
  const unitParent = useSetterSection(feInfo);
  const totalVarb = unitParent.switchVarb("targetRent", "ongoing");

  const unitIds = unitParent.childFeIds("unit");

  const { isAtLeastOne, areMultiple, areNone } = useHowMany(unitIds);
  const unitIdRows = Arr.upOneDimension(unitIds, numUnitsPerRow);
  const { trackWidthToggleView, ...titleRowProps } = useOpenWidth();
  const { viewIsOpen } = titleRowProps;

  const addUnit = () => unitParent.addChild("unit");
  return (
    <Styled
      className={`UnitList-root ${className ?? ""}`}
      {...{ isAtLeastOne }}
    >
      <div className="UnitList-viewable">
        <div className="title-row">
          {areNone && (
            <PlusBtn className="UnitList-addUnitBtn" onClick={addUnit}>
              + Unit
              {/* <VscDiffAdded className="UnitList-addUnitBtnIcon" /> */}
            </PlusBtn>
          )}
        </div>
        {viewIsOpen && (
          <div className="UnitList-unitsArea">
            {isAtLeastOne && (
              <div className="UnitList-units">
                <div className="UnitList-unitRows">
                  {unitIdRows.map((idRow, rowIndex) => {
                    const unitNumberOffset = rowIndex * numUnitsPerRow;
                    return (
                      <div className="UnitList-unitRow" key={rowIndex}>
                        {rowIndex === 0 && (
                          <>
                            <PlusBtn
                              className="UnitList-addUnitBtn"
                              onClick={addUnit}
                            >
                              + Unit
                              {/* <VscDiffAdded className="UnitList-addUnitBtnIcon" /> */}
                            </PlusBtn>
                            {areMultiple && (
                              <div className="UnitList-total">
                                <span className="UnitList-totalText">{`Total Rent`}</span>
                                <span className="UnitList-totalNumber">{`(${totalVarb.displayVarb()})`}</span>
                              </div>
                            )}
                          </>
                        )}
                        <div className="UnitList-unitRowInner">
                          {idRow.map((unitId, unitInnerIndex) => {
                            const unitIndex = unitNumberOffset + unitInnerIndex;
                            const unitNumber = unitIndex + 1;
                            return (
                              <UnitItemNext
                                key={unitId}
                                feId={unitId}
                                unitNumber={unitNumber}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Styled>
  );
}

/* ${ccs.subSection.main("property")}; */
const Styled = styled.div<{ isAtLeastOne: boolean }>`
  .UnitList-viewable {
    /* max-width: 240px; */
  }
  .UnitList-unitRows {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 0 1;
    margin-top: ${theme.s1};
  }

  .UnitList-total {
    display: flex;
    padding: ${theme.s2};
    background-color: ${theme.property.light};
    box-shadow: ${theme.boxShadow1};
  }
  .UnitList-totalText {
    font-size: ${rem("15px")};
    font-weight: 700;
    color: ${theme["gray-700"]};
  }
  .UnitList-totalNumber {
    margin-left: ${theme.s2};
  }

  .UnitList-addUnitBtn {
    font-weight: 700;
    font-size: 0.9rem;
    line-height: 1.2rem;
    height: 26px;
    box-shadow: ${theme.boxShadow1};
  }

  .UnitList-addUnitBtnIcon {
    font-size: 23px;
  }

  .UnitList-unitRowInner {
    display: flex;
    /* border-top: 1px solid ${theme.property.border}; */
  }
  .UnitItem-root {
    margin-top: 1px;
    :not(:first-child) {
      margin-left: 1px;
      /* border-left: 1px solid ${theme.property.dark}; */
    }
  }

  .UnitList-unitRow {
    :not(:first-child) {
    }
  }

  .XBtn {
    ${ccs.shape.button.smallCurved};
  }

  ${({ isAtLeastOne }) =>
    isAtLeastOne
      ? css`
          .UnitList-addUnitBtn {
            width: 100%;
            box-shadow: none;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
        `
      : css`
          .UnitList-addUnitBtn {
            width: ${rem("75px")};
            white-space: nowrap;
          }
          .title-row {
            align-items: center;
            h6.title-text {
              padding-top: ${rem("5px")};
            }
            .PlusBtn {
              margin-top: ${theme.s1};
            }
          }
        `}
`;
