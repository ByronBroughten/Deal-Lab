import React from "react";
import styled from "styled-components";
import theme from "../../../../../../theme/Theme";
import ControlContent from "./ConditionalRows/ControlContent";
import LogicContent from "./ConditionalRows/LogicContent";
import XBtnContent from "./ConditionalRows/XBtnContent";

export const conditionalRowSectionName = "conditionalRow";
type Props = {
  conditionalRowIds: string[];
};
export default function ConditionalRows({ conditionalRowIds }: Props) {
  return (
    <Styled className="conditional-content-group">
      <ControlContent className="content-section" {...{ conditionalRowIds }} />
      <LogicContent {...{ conditionalRowIds }} className="content-section" />
      <XBtnContent className="content-section" {...{ conditionalRowIds }} />
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex: 0 1;

  .content-section:not(:first-child) {
    margin-left: ${theme.s2};
  }
  .control-content {
    margin-left: 0;
  }

  .content-row:not(:first-child) {
    margin-top: ${theme.s2};
  }
`;
