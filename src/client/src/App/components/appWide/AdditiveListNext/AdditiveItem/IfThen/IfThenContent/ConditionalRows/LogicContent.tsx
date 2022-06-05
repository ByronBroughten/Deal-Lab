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
        {conditionalRowIds.map((feId: string, idx: number) => (
          <LogicRow feId={feId} key={feId} idx={idx} />
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
