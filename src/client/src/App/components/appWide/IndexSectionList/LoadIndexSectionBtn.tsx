import React from "react";
import styled from "styled-components";
import theme from "../../../theme/Theme";
import PlainBtn from "../../general/PlainBtn";

type Props = {
  text: string;
  onClick: () => void;
};

export default React.memo(function LoadIndexSectionBtn({
  text,
  onClick,
}: Props) {
  return (
    <Styled className="LoadIndexSectionBtn-root" onClick={onClick}>
      {text}
    </Styled>
  );
});

const Styled = styled(PlainBtn)`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  white-space: nowrap;
  :hover {
    background-color: ${theme["gray-400"]};
  }
`;
