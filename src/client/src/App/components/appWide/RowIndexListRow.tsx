import React from "react";
import styled from "styled-components";
import TrashBtn from "../general/TrashBtn";
import theme from "./../../theme/Theme";
import PlainBtn from "./../general/PlainBtn";

type Props = {
  displayName: string;
  load: () => void;
  del: () => void;
};
export function RowIndexListRow({ displayName, del, load }: Props) {
  return (
    <Styled className="RowIndexRows-entry">
      <PlainBtn className="LoadSectionBtn-root" onClick={load}>
        <span className="LoadSectionBtn-loadText">load</span>
        <span className="LoadSectionBtn-nameText">{displayName}</span>
      </PlainBtn>
      <TrashBtn onClick={del} />
    </Styled>
  );
}

const Styled = styled.div`
  min-width: 200px;
  display: flex;
  height: 30px;

  .TrashBtn-root {
    width: 25px;
  }
  .LoadSectionBtn-root {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    white-space: nowrap;
    :hover {
      background-color: ${theme["gray-400"]};
    }
  }
  .LoadSectionBtn-loadText {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    line-height: 0.8rem;
  }
  .LoadSectionBtn-nameText {
    display: flex;
    align-items: center;
    margin-left: ${theme.s4};
  }
`;
