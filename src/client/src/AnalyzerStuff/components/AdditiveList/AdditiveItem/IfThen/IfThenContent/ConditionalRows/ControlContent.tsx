import React from "react";
import styled from "styled-components";
import ControlRow from "./ControlRow";

export default function ControlContent({
  conditionalRowIds,
  className = "",
}: {
  conditionalRowIds: string[];
  className?: string;
}) {
  return (
    <Styled className={`control-content content-section  + ${className}`}>
      {conditionalRowIds.map((rowId: string, idx: number) => (
        <ControlRow key={rowId} id={rowId} idx={idx} />
      ))}
    </Styled>
  );
}

const Styled = styled.div`
  .control-row:first-child {
    .tic-btn {
      visibility: hidden;
    }
  }

  .control-row:last-child {
    .tic-btn {
      visibility: hidden;
    }
  }
`;
