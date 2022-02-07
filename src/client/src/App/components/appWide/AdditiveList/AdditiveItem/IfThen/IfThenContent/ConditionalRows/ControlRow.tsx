import React from "react";
import styled from "styled-components";
import TicBtn from "./ControlRow/TicBtn";
import { useAnalyzerContext } from "../../../../../../../modules/usePropertyAnalyzer";
import theme from "../../../../../../../theme/Theme";

const sectionName = "conditionalRow";
export default function ControlRow({ id, idx }: { id: string; idx: number }) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  const { analyzer, handleDirectUpdate } = useAnalyzerContext();
  const level = analyzer.feVarb("level", feInfo);
  const incrementLevel = (num: number) =>
    handleDirectUpdate(level.feVarbInfo, level.value("number") + num);

  const [height, setHeight] = React.useState("31px");
  const ccRef = React.useRef(null);
  React.useEffect(() => {
    if (ccRef.current) {
      const logicRows = document.getElementsByClassName(`logic-row ${idx}`);
      const logicRow = logicRows[0];
      const newHeight = `${logicRow.clientHeight}px`;

      if (newHeight !== height) {
        setHeight(newHeight);
      }
    }
  });

  return (
    <StyledBox
      {...{ height, ref: ccRef, className: "control-row content-row" }}
    >
      <TicBtn className="left" onClick={() => incrementLevel(-1)}>
        {"<"}
      </TicBtn>
      <TicBtn className="right" onClick={() => incrementLevel(1)}>
        {">"}
      </TicBtn>
    </StyledBox>
  );
}

const StyledBox = styled.div<{ height: string; ref: any }>`
  display: flex;
  align-items: flex-start;
  height: ${({ height }) => height};

  .PlusBtn,
  .tic-btn {
    height: ${({ height }) => height};
  }

  .tic-btn.right {
    margin-left: ${theme.s1};
  }
`;
