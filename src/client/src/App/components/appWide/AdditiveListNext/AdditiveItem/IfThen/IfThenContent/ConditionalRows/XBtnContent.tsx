import React from "react";
import styled from "styled-components/macro";
import theme from "../../../../../../../theme/Theme";
import XBtnRow from "./XBtnContent/XBtnRow";

export default function XBtnContent({
  conditionalRowIds,
  className,
}: {
  conditionalRowIds: string[];
  className: string;
}) {
  return (
    <Styled className={`XBtn-content ${className ?? ""}`}>
      {conditionalRowIds.map((feId: string, idx: number) => (
        <XBtnRow {...{ feId, idx, key: feId }} />
      ))}
    </Styled>
  );
}

const Styled = styled.div`
  .XBtn {
    margin-left: ${theme.s2};
  }

  .XBtn-row:first-child {
    .XBtn {
      visibility: hidden;
    }
  }
  .XBtn-row:last-child {
    .XBtn,
    .PlusBtn {
      visibility: hidden;
    }
  }
`;
