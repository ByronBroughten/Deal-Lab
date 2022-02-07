import React from "react";
import styled, { css } from "styled-components";
import theme from "../../../../../theme/Theme";
import { useAnalyzerContext } from "../../../../../modules/usePropertyAnalyzer";
import { useOpenWidth } from "../../../../appWide/SectionTitleRow";
import ToggleViewBtn from "../../../../general/ToggleViewBtn";
import Unit from "./UnitList/Unit";
import ccs from "../../../../../theme/cssChunks";
import array from "../../../../../sharedWithServer/utils/Arr";
import { rem } from "polished";
import useHowMany from "../../../../appWide/customHooks/useHowMany";
import PlusBtn from "../../../../appWide/PlusBtn";
import { FeParentInfo } from "../../../../../sharedWithServer/Analyzer/SectionMetas/relSectionTypes";

type Props = { feInfo: FeParentInfo<"unit">; className?: string };
export default function UnitList({ feInfo, className }: Props) {
  const { analyzer, handleAddSection } = useAnalyzerContext();
  const totalDisplay = analyzer.switchedOngoingDisplayVarb(
    "targetRent",
    feInfo
  );

  const unitIds = analyzer.section(feInfo).childFeIds("unit");
  const { isAtLeastOne, areMultiple: areMultiple } = useHowMany(unitIds);
  const numUnitsPerRow = 2;
  const unitIdRows = array.upOneDimension(unitIds, numUnitsPerRow);

  const { trackWidthToggleView, ...titleRowProps } = useOpenWidth();
  const { viewIsOpen } = titleRowProps;

  const addUnit = () => handleAddSection("unit", feInfo);

  return (
    <Styled className={"UnitList-root " + className} {...{ isAtLeastOne }}>
      <div className="viewable">
        <div className="title-row">
          <h6 className="title-text">Units</h6>
          {isAtLeastOne ? (
            <ToggleViewBtn {...{ viewIsOpen, onClick: trackWidthToggleView }} />
          ) : (
            <PlusBtn className="UnitList-addUnitBtn" onClick={addUnit}>
              Add Unit
            </PlusBtn>
          )}
        </div>
        {viewIsOpen && (
          <div className="unit-list">
            {isAtLeastOne && (
              <div className="units">
                {areMultiple && (
                  <div className="total">{`Total rent: ${totalDisplay}`}</div>
                )}
                <div className="unit-rows">
                  {unitIdRows.map((idRow, rowIndex) => {
                    const unitNumberOffset = rowIndex * numUnitsPerRow;
                    return (
                      <div className="unit-row" key={rowIndex}>
                        {rowIndex === 0 && (
                          <PlusBtn
                            className="UnitList-addUnitBtn"
                            onClick={addUnit}
                          >
                            Add Unit
                          </PlusBtn>
                        )}
                        <div className="unit-row-inner">
                          {idRow.map((unitId, unitInnerIndex) => {
                            const unitIndex = unitNumberOffset + unitInnerIndex;
                            const unitNumber = unitIndex + 1;
                            return (
                              <Unit
                                key={unitId}
                                id={unitId}
                                idx={unitIndex}
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

const Styled = styled.div<{ isAtLeastOne: boolean }>`
  max-width: 246.19px;
  ${ccs.subSection.main("property")};
  .unit-list {
    .units {
      display: inline-block;
      .unit-rows {
        .unit-row {
          display: inline-block;

          :first-child {
            .unit-row-inner {
              /* border-top: 2px solid ${theme.property.border}; */
            }
          }

          .unit-row-inner {
            display: flex;
            border-top: 1px solid ${theme.property.border};

            .unit-item {
              .viewable {
                border: none;
              }
              :not(:first-child) {
                border-left: 1px solid ${theme.property.border};
              }
            }
          }
        }
      }
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
              margin-left: ${theme.s2};
            }
          }
        `}
`;
