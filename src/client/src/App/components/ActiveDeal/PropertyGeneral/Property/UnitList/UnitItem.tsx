import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import ccs from "../../../../../theme/cssChunks";
import theme from "../../../../../theme/Theme";
import XBtn from "../../../../appWide/Xbtn";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

type Props = { feId: string; unitNumber: number };
export function UnitItem({ feId, unitNumber }: Props) {
  const unit = useSetterSection({ sectionName: "unit", feId });
  return (
    <Styled className="UnitItem-root" key={feId}>
      <div className="UnitItem-viewable">
        <div className="UnitItem-titleRow">
          <div className="UnitItem-titleText">Unit {unitNumber}</div>
          <XBtn className="UnitItem-xBtn" onClick={() => unit.removeSelf()} />
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

const Styled = styled.div`
  min-width: ${unitItemWidth};
  .UnitItem-viewable {
    ${ccs.mainColorSection("property")};
    padding: ${theme.s2};
    box-shadow: ${theme.boxShadow1};
  }
  /* .UnitItem-xBtn {
    visibility: hidden;
  }
  :hover {
    .UnitItem-xBtn {
      visibility: visible;
    }
  } */
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
