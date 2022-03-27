import React from "react";
import styled from "styled-components/macro";
import XBtnRow from "./XBtnContent/XBtnRow";
import theme from "../../../../../../../theme/Theme";
import { conditionalRowSectionName } from "../ConditionalRows";
import { FeParentInfo } from "../../../../../../../sharedWithServer/Analyzer/SectionMetas/relNameArrs/ParentTypes";

export default function XBtnContent({
  conditionalRowIds,
  parentInfo,
  className,
  ...rest
}: {
  [key: string]: any;
  conditionalRowIds: string[];
  parentInfo: FeParentInfo<typeof conditionalRowSectionName>;
  className: string;
}) {
  return (
    <Styled className={className} {...rest}>
      {conditionalRowIds.map((id: string, idx: number) => (
        <XBtnRow {...{ key: id, id, parentInfo, idx }} />
      ))}
    </Styled>
  );
}

const Styled = styled.div.attrs(({ className, ...rest }) => ({
  className: "XBtn-content " + className,
  ...rest,
}))`
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
