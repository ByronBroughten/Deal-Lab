import React from "react";
import styled from "styled-components";
import { useSetterVarb } from "../../../../../../../sharedWithServer/stateClassHooks/useSetterVarb";
import theme from "../../../../../../../theme/Theme";
import TicBtn from "./ControlRow/TicBtn";

export default function ControlRow({
  feId,
  idx,
}: {
  feId: string;
  idx: number;
}) {
  const levelVarb = useSetterVarb({
    sectionName: "conditionalRow",
    feId,
    varbName: "level",
  });
  const incrementLevel = (num: number) =>
    levelVarb.updateValueDirectly(levelVarb.value("number") + num);

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
