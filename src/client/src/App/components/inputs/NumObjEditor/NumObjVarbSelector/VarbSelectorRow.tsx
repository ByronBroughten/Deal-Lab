import styled from "styled-components";
import theme from "../../../../theme/Theme";
import PlainBtn from "../../../general/PlainBtn";

type Props = {
  className?: string;
  displayName: string;
  onClick: () => void;
};
export function VarbSelectorRow({ displayName, onClick }: Props) {
  return (
    <Styled>
      <PlainBtn className="VarbSelectorRow-root" onClick={onClick}>
        <span className="VarbSelectorRow-nameText">{displayName}</span>
      </PlainBtn>
    </Styled>
  );
}

const Styled = styled.div`
  min-width: 100px;
  display: flex;
  padding: 0;
  .VarbSelectorRow-root {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    white-space: nowrap;
    :hover {
      background-color: ${theme["gray-400"]};
    }
  }
  .VarbSelectorRow-nameText {
    display: flex;
    align-items: center;
    margin-left: ${theme.s4};
  }
`;
