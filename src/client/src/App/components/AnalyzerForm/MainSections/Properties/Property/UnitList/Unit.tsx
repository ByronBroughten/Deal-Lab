import React from "react";
import styled from "styled-components";
import { useAnalyzerContext } from "../../../../../../modules/usePropertyAnalyzer";
import { Inf } from "../../../../../../sharedWithServer/Analyzer/SectionMetas/Info";
import ccs from "../../../../../../theme/cssChunks";
import theme from "../../../../../../theme/Theme";
import XBtn from "../../../../../appWide/Xbtn";
import NumObjEditor from "../../../../../inputs/NumObjEditor";

type Props = { id: string; idx: number; unitNumber: number };
const sectionName = "unit";
export default function UnitItem({ id, unitNumber }: Props) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  const { analyzer, handleRemoveSection } = useAnalyzerContext();

  const targetRentVarb = analyzer.switchedOngoingVarb(feInfo, "targetRent");
  return (
    <Styled className="unit-item" key={id}>
      <div className="viewable">
        <div className="title-row">
          <h6 className="title-text">Unit {unitNumber}</h6>
          <XBtn
            className="Unit-xBtn"
            onClick={() => handleRemoveSection(feInfo)}
          />
        </div>
        <NumObjEditor
          className="brs"
          feVarbInfo={Inf.feVarb("numBedrooms", feInfo)}
        />
        <NumObjEditor
          className="target-rent"
          feVarbInfo={targetRentVarb.feVarbInfo}
        />
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  min-width: 120px;
  ${ccs.subSection.main("property")};

  .Unit-xBtn {
    visibility: hidden;
  }

  :hover {
    .Unit-xBtn {
      visibility: visible;
    }
  }

  div.viewable {
    background-color: ${theme.property.light};
    padding: ${theme.s2};
    display: flex;
    flex-direction: column;
  }

  div.title-row {
    align-items: center;
    h6.title-text {
      margin-right: ${theme.s2};
      font-size: 0.9rem;
    }
  }

  .numeric-editor {
    margin-top: ${theme.s2};
    .editor-background {
      background-color: ${theme.property.light};
      ..DraftTextField-root {
        min-width: 35px;
      }
    }
  }
`;
