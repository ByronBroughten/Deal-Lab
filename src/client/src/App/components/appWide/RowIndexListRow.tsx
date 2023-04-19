import styled from "styled-components";
import { TrashBtn } from "../general/TrashBtn";
import theme from "./../../theme/Theme";
import PlainBtn from "./../general/PlainBtn";

type Props = {
  className?: string;
  displayName: string;
  load: () => void;
  del?: () => void;
};
export function RowIndexListRow({ displayName, del, load, className }: Props) {
  return (
    <StyledRowIndexRow className={`RowIndexListRow-root ${className ?? ""}`}>
      <PlainBtn className="LoadSectionBtn-root" onClick={load}>
        <span className="LoadSectionBtn-nameText">{displayName}</span>
      </PlainBtn>
      {del && <TrashBtn onClick={del} />}
    </StyledRowIndexRow>
  );
}

export const StyledRowIndexRow = styled.div`
  min-width: 200px;
  display: flex;
  padding: 0;
  .TrashBtn-root {
    min-width: 25px;
  }
  .LoadSectionBtn-root {
    color: ${theme.dark};
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    white-space: nowrap;
    :hover {
      background-color: ${theme["gray-400"]};
    }
  }
  .LoadSectionBtn-nameText {
    display: flex;
    align-items: center;
    padding-left: ${theme.s4};
  }
`;
