import React from "react";
import styled from "styled-components";
import { FeParentInfo } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { Arr } from "../../../../../sharedWithServer/utils/Arr";
import ccs from "../../../../../theme/cssChunks";
import theme from "../../../../../theme/Theme";
import useHowMany from "../../../../appWide/customHooks/useHowMany";
import { useOpenWidth } from "../../../../appWide/customHooks/useOpenWidth";
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
          <div className="UnitList-unitRows">
            {unitIdRows.map((idRow, rowIndex) => {
              const unitNumberOffset = rowIndex * numUnitsPerRow;
              return (
                <div className="UnitList-unitRow" key={idRow[0]}>
                  {idRow.map((unitId, unitInnerIndex) => {
                    const unitIndex = unitNumberOffset + unitInnerIndex;
                    const unitNumber = unitIndex + 1;
                    return unitId === "addUnitBtn" ? (
                      <AddUnitBtn
                        className="UnitList-addUnitBtn"
                        onClick={addUnit}
                        key={unitId}
                      />
                    ) : (
                      <UnitItem
                        key={unitId}
                        feId={unitId}
                        unitNumber={unitNumber}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Styled>
  );
}

const Styled = styled.div<{
  $isAtLeastOne: boolean;
  $areMultiple: boolean;
  $areNone: boolean;
  $isOne: boolean;
  $isEven: boolean;
}>`
  .UnitList-unitRow {
    display: flex;
    flex-wrap: nowrap;
  }

  .UnitList-unitRows {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .XBtn {
    ${ccs.shape.button.smallCurved};
  }
  .UnitItem-root {
    margin: ${theme.flexElementSpacing};
  }
`;
