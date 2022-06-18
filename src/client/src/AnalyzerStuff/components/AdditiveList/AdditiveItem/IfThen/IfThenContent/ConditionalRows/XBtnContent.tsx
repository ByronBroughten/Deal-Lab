import React from "react";
import styled from "styled-components/macro";
import { ParentFeInfo } from "../../../../../../../App/sharedWithServer/SectionsMeta/relSectionTypes/ParentTypes";
import theme from "../../../../../../../App/theme/Theme";
import { conditionalRowSectionName } from "../ConditionalRows";
import XBtnRow from "./XBtnContent/XBtnRow";

export default function XBtnContent({
  conditionalRowIds,
  parentInfo,
  className,
  ...rest
}: {
  [key: string]: any;
  conditionalRowIds: string[];
  parentInfo: ParentFeInfo<typeof conditionalRowSectionName>;
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
