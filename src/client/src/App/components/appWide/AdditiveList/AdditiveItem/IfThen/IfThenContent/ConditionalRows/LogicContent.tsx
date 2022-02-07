import React from "react";
import styled from "styled-components";
import LogicRow from "../LogicRow";

export default function LogicContent({
  conditionalRowIds,
  ...rest
}: {
  [key: string]: any;
  conditionalRowIds: string[];
  className?: string;
}) {
  return (
    <Styled {...rest}>
      <div>
        {conditionalRowIds.map((rowId: string, idx: number) => (
          <LogicRow id={rowId} key={rowId} idx={idx} />
        ))}
      </div>
    </Styled>
  );
}

const Styled = styled.div.attrs(({ className, ...rest }) => ({
  className: "logic-content content-section" + className,
  ...rest,
}))`
  display: flex;
`;
