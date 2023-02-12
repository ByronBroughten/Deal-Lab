import styled from "styled-components";
import theme from "../../../../theme/Theme";
import PlainBtn from "../../../general/PlainBtn";

type Props = {
  className?: string;
  displayName: string;
  onClick: () => void;
};
export function VarbSelectorRow({ displayName, onClick, className }: Props) {
  return (
    <Styled className={`VarbSelectorRow-root ${className ?? ""}`}>
      <PlainBtn className="VarbSelectorRow-Btn" onClick={onClick}>
        <span className="VarbSelectorRow-nameText">{displayName}</span>
      </PlainBtn>
    </Styled>
  );
}

const Styled = styled.div`
  min-width: 150px;
  display: flex;
  padding: 0;
  .VarbSelectorRow-Btn {
    border-top: solid 1px ${theme["gray-300"]};
    height: 30px;
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    white-space: nowrap;
    padding-left: ${theme.s4};
    background-color: ${theme.light};
    :hover {
      background-color: ${theme["gray-100"]};
    }
  }
  .VarbSelectorRow-nameText {
    display: flex;
    align-items: center;
  }
`;
