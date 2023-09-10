import React from "react";
import styled from "styled-components";
import { useAction } from "../../../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { Arr } from "../../../../../../../sharedWithServer/utils/Arr";
import ccs from "../../../../../../../theme/cssChunks";
import theme from "../../../../../../../theme/Theme";
import useHowMany from "../../../../../../customHooks/useHowMany";
import { AddUnitBtn } from "./UnitList/AddUnitBtn";
import { UnitItem } from "./UnitList/UnitItem";

type Props = { feId: string; showRent?: boolean; className?: string };
export function UnitList({ feId, showRent = true, className }: Props) {
  const addChild = useAction("addChild");
  const numUnitsPerRow = 2;
  const unitParent = useGetterSection({
    sectionName: "property",
    feId,
  });

  let unitIds = [...unitParent.childFeIds("unit")];
  const { isAtLeastOne, areMultiple, areNone, isOne, isEven } =
    useHowMany(unitIds);
  unitIds = [...unitIds, "addUnitBtn"];

  const unitIdRows = Arr.upOneDimension(unitIds, numUnitsPerRow);
  const addUnit = () =>
    addChild({ feInfo: unitParent.feInfo, childName: "unit" });
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
        <div className="UnitList-unitRows">
          {unitIdRows.map((idRow, rowIndex) => {
            const unitNumberOffset = rowIndex * numUnitsPerRow;
            return (
              <div className="UnitList-unitRow" key={idRow[0]}>
                {idRow.map((unitId, unitInnerIndex) => {
                  const unitIndex = unitNumberOffset + unitInnerIndex;
                  const unitNumber = unitIndex + 1;
                  return unitId === "addUnitBtn" ? (
                    <AddUnitBtn onClick={addUnit} key={unitId} />
                  ) : (
                    <UnitItem
                      key={unitId}
                      feId={unitId}
                      unitNumber={unitNumber}
                      showXBtn={unitIds.length > 1}
                      showRent={showRent}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
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
