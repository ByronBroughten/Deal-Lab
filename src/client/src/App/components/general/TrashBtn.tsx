import React from "react";
import { MdDelete } from "react-icons/md";
import styled from "styled-components";
import theme from "../../theme/Theme";
import PlainIconBtn from "./PlainIconBtn";
import { StandardBtnProps } from "./StandardProps";

type Props = StandardBtnProps;
export default function TrashBtn({ className, ...rest }: Props) {
  return (
    <Styled {...{ className: `TrashBtn-root ${className ?? ""}`, ...rest }}>
      <MdDelete className="icon" />
    </Styled>
  );
}

const Styled = styled(PlainIconBtn)`
  :hover {
    color: ${theme.danger};
  }
  .icon {
    position: absolute;
    height: 120%;
    width: 120%;
  }
`;
