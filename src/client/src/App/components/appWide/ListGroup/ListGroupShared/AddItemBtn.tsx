import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import styled from "styled-components";
import { StandardBtnProps } from "../../../general/StandardProps";
import { SectionBtn } from "../../SectionBtn";

interface Props extends StandardBtnProps {
  middle?: React.ReactNode;
}
export function AddItemBtn({
  className,
  middle = <AiOutlinePlus size={17} />,
  ...props
}: Props) {
  return (
    <Styled
      {...{
        className: `VarbListTable-addItemBtn ${className ?? ""}`,
        middle,
        ...props,
      }}
    />
  );
}

const Styled = styled(SectionBtn)`
  height: 30px;
  font-size: 16px;
  box-shadow: none;
  width: 100%;
`;

// width: 100%;
// color: ${theme.light};
// background: ${theme.primaryNext};
