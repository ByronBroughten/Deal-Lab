import { rem } from "polished";
import React from "react";
import styled, { css } from "styled-components";
import { FeParentInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { Arr } from "../../../../sharedWithServer/utils/Arr";
import ccs from "../../../../theme/cssChunks";
import theme from "../../../../theme/Theme";
import useHowMany from "../../../appWide/customHooks/useHowMany";
import { useOpenWidth } from "../../../appWide/SectionTitleRow";
import { AddUnitBtn } from "./UnitList/AddUnitBtn";
import { UnitItem } from "./UnitList/UnitItem";

type Props = { feInfo: FeParentInfo<"unit">; className?: string };
export function UnitList({ feInfo, className }: Props) {
  const numUnitsPerRow = 2;
  const unitParent = useSetterSection(feInfo);
  const totalVarb = unitParent.switchVarb("targetRent", "ongoing");

  let unitIds = [...unitParent.childFeIds("unit")];
  const { isAtLeastOne, areMultiple, areNone, isOne, isEven } =
    useHowMany(unitIds);
  unitIds = [...unitIds, "addUnitBtn"];

  const unitIdRows = Arr.upOneDimension(unitIds, numUnitsPerRow);
  const { trackWidthToggleView, ...titleRowProps } = useOpenWidth();
  const { viewIsOpen } = titleRowProps;

  const addUnit = () => unitParent.addChild("unit");
  return (
    <Styled
      className={`UnitList-root ${className ?? ""}`}
      {...{
        $isAtLeastOne: isAtLeastOne,
        $areMultiple: areMultiple,
        $areNone: areNone,
        $isOne: isOne,
        $isEven: isEven,
      }}
    >
      <div className="UnitList-viewable">
        {viewIsOpen && (
          <div className="UnitList-unitsArea">
            <div className="UnitList-units">
              <div className="UnitList-unitRows">
                {unitIdRows.map((idRow, rowIndex) => {
                  const unitNumberOffset = rowIndex * numUnitsPerRow;
                  return (
                    <div className="UnitList-unitRow" key={rowIndex}>
                      {rowIndex === 0 && (
                        <>
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
                          return unitId === "addUnitBtn" ? (
                            <div className="UnitList-addUnitBtnDiv">
                              <AddUnitBtn
                                key={unitId}
                                className="UnitList-addUnitBtn"
                                onClick={addUnit}
                              />
                            </div>
                          ) : (
                            <UnitItem
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
          </div>
        )}
      </div>
    </Styled>
  );
}

/* ${ccs.subSection.main("property")}; */
const Styled = styled.div<{
  $isAtLeastOne: boolean;
  $areMultiple: boolean;
  $areNone: boolean;
  $isOne: boolean;
  $isEven: boolean;
}>`
  .UnitList-addUnitBtnDiv {
    display: flex;
    padding: ${theme.s3};
    min-width: 109px;
    ${({ $isEven, $areMultiple }) =>
      $isEven &&
      $areMultiple &&
      css`
        justify-content: flex-end;
      `}
    ${({ $isOne }) =>
      $isOne &&
      css`
        padding-top: 0px;
      `}

    ${({ $areNone }) =>
      $areNone &&
      css`
        padding-left: 0px;
        padding-top: 0px;
      `}
  }
  .UnitList-unitRows {
  }
  // isEven and isAtLeastOne
  .UnitList-unitrow {
  }
  .UnitList-unitRowInner {
    display: flex;
  }
  .UnitList-total {
    padding: ${theme.s2};
    ${ccs.mainColorSection("property")};
    border-top-left-radius: ${theme.br1};
    border-top-right-radius: ${theme.br1};

    box-shadow: ${theme.boxShadow1};
    height: 1rem;
  }
  .UnitList-totalText {
    font-size: ${rem("15px")};
    font-weight: 700;
    color: ${theme["gray-700"]};
  }
  .UnitList-totalNumber {
    margin-left: ${theme.s2};
  }

  .XBtn {
    ${ccs.shape.button.smallCurved};
  }
`;
