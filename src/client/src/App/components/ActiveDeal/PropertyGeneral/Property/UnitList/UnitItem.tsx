import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import ccs from "../../../../../theme/cssChunks";
import theme from "../../../../../theme/Theme";
import { RemoveSectionXBtn } from "../../../../appWide/RemoveSectionXBtn";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

type Props = { feId: string; unitNumber: number };
export function UnitItem({ feId, unitNumber }: Props) {
  const feInfo = { sectionName: "unit", feId } as const;
  const unit = useSetterSection(feInfo);
  return (
    <Styled className="UnitItem-root" key={feId}>
      <div className="UnitItem-viewable">
        <div className="UnitItem-titleRow">
          <div className="UnitItem-titleText">Unit {unitNumber}</div>
          <RemoveSectionXBtn className="UnitItem-xBtn" {...feInfo} />
        </div>
        <NumObjEntityEditor
          className="brs"
          feVarbInfo={unit.varbInfo("numBedrooms")}
        />
        <NumObjEntityEditor
          className="target-rent"
          feVarbInfo={unit.switchVarbInfo("targetRent", "ongoing")}
        />
      </div>
    </Styled>
  );
}

export const unitItemWidth = "125px";
export const unitItemHeight = "113px";

const Styled = styled.div`
  min-width: ${unitItemWidth};
  min-height: ${unitItemHeight};
  .UnitItem-viewable {
    ${ccs.mainColorSection("property")};
    border-radius: ${theme.br1};
    padding: ${theme.s2};
    box-shadow: ${theme.boxShadow1};
  }
  .UnitItem-titleRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .UnitItem-titleText {
    margin-right: ${theme.s2};
    font-size: 0.9rem;
    font-weight: 700;
    color: ${theme["gray-700"]};
  }

  .NumObjEditor-inner {
    margin-top: ${theme.s2};

    .editor-background {
      background-color: ${theme.property.light};
      .DraftTextField-root {
        min-width: 110px;
      }
    }
  }
`;
