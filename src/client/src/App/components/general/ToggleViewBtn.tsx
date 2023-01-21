import React from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { PlainIconBtn } from "./PlainIconBtn";

export default function ToggleViewBtn({
  className = "",
  viewIsOpen,
  ...rest
}: {
  className?: string;
  viewIsOpen: boolean;
  onClick?: any;
}) {
  const middle = viewIsOpen ? (
    <FiMaximize2 className="icon" />
  ) : (
    <FiMinimize2 className="icon" />
  );
  return (
    <Styled
      className={"ToggleViewBtn-root " + className}
      {...{ ...rest, middle }}
    />
  );
}

const Styled = styled(PlainIconBtn)`
  :hover {
    color: ${theme["gray-500"]};
  }
`;
