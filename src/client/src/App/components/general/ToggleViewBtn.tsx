import React, { MouseEventHandler } from "react";
import { FiMinimize2, FiMaximize2 } from "react-icons/fi";
import theme from "../../theme/Theme";
import PlainIconBtn from "./PlainIconBtn";
import styled from "styled-components";

export default function ToggleViewBtn({
  className = "",
  viewIsOpen,
  ...rest
}: {
  className?: string;
  viewIsOpen: boolean;
  onClick?: any;
}) {
  return (
    <Styled className={"toggle-view-btn " + className} {...rest}>
      {!viewIsOpen && <FiMinimize2 className="icon" />}
      {viewIsOpen && <FiMaximize2 className="icon" />}
    </Styled>
  );
}

const Styled = styled(PlainIconBtn)`
  :hover {
    color: ${theme["gray-500"]};
  }
`;
