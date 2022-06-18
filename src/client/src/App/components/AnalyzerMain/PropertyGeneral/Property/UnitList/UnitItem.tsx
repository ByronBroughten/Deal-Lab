import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import ccs from "../../../../../theme/cssChunks";
import theme from "../../../../../theme/Theme";
import XBtn from "../../../../appWide/Xbtn";
import { NumObjEditorNext } from "../../../../inputs/NumObjEditorNext";

type Props = { feId: string; unitNumber: number };
export function UnitItemNext({ feId, unitNumber }: Props) {
  const unit = useSetterSection({ sectionName: "unit", feId });
  return (
    <Styled className="UnitItem-root" key={feId}>
      <div className="UnitItem-viewable">
        <div className="UnitItem-titleRow title-row">
          <h6 className="title-text">Unit {unitNumber}</h6>
          <XBtn className="UnitItem-xBtn" onClick={() => unit.removeSelf()} />
        </div>
        <NumObjEditorNext
          className="brs"
          feVarbInfo={unit.varbInfo("numBedrooms")}
        />
        <NumObjEditorNext
          className="target-rent"
          feVarbInfo={unit.switchVarbInfo("targetRent", "ongoing")}
        />
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  min-width: 130px;
  ${ccs.subSection.main("property")};

  .UnitItem-xBtn {
    visibility: hidden;
  }

  :hover {
    .UnitItem-xBtn {
      visibility: visible;
    }
  }

  .UnitItem-viewable {
    background-color: ${theme.property.light};
    padding: ${theme.s2};
    display: flex;
    flex-direction: column;
    box-shadow: ${theme.boxShadow1};
  }

  .UnitItem-titleRow {
    align-items: center;
    h6.title-text {
      margin-right: ${theme.s2};
      font-size: 0.9rem;
    }
  }

  .NumObjEditor-inner {
    margin-top: ${theme.s2};
    .editor-background {
      background-color: ${theme.property.light};
      ..DraftTextField-root {
        min-width: 35px;
      }
    }
  }
`;
