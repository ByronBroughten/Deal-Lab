import React from "react";
import styled from "styled-components";
import { useAnalyzerContext } from "../../../../../modules/usePropertyAnalyzer";
import { Inf } from "../../../../../sharedWithServer/Analyzer/SectionMetas/Info";
import ccs from "../../../../../theme/cssChunks";
import theme from "../../../../../theme/Theme";
import XBtn from "../../../../appWide/Xbtn";
import NumObjEditor from "../../../../inputs/NumObjEditor";

type Props = { id: string; idx: number; unitNumber: number };
const sectionName = "unit";
export default function UnitItem({ id, unitNumber }: Props) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  const { analyzer, handleRemoveSection } = useAnalyzerContext();

  const targetRentVarb = analyzer.switchedOngoingVarb("targetRent", feInfo);
  return (
    <Styled className="UnitItem-root" key={id}>
      <div className="UnitItem-viewable">
        <div className="UnitItem-titleRow title-row">
          <h6 className="title-text">Unit {unitNumber}</h6>
          <XBtn
            className="UnitItem-xBtn"
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
