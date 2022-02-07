import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { Button } from "@material-ui/core";
import ccs from "../../../../theme/cssChunks";

type Props = {
  handleClick: (char: string) => void;
  handleBackspace: () => void;
};
export default function CalculatorBtns({
  handleClick,
  handleBackspace,
}: Props) {
  return (
    <Styled className="calculator">
      {[
        ["1", "2", "3", "+"],
        ["4", "5", "6", "-"],
        ["7", "8", "9", "*"],
        ["del", "0", ".", "/"],
      ].map((list) => (
        <div className="calc-button-row" key={list[0]}>
          {list.map((char) => {
            const onClick =
              char === "del" ? handleBackspace : () => handleClick(char);
            return (
              <Button className="calc-btn" key={char} onClick={onClick}>
                {char}
              </Button>
            );
          })}
        </div>
      ))}
    </Styled>
  );
}

const calcBtnSize = "1.35rem";

const Styled = styled.div`
  .calc-button-row {
    display: flex;
  }

  .calc-button-row:not(:first-child) {
    margin-top: ${theme.s1};
  }
  .calc-btn:not(:first-child) {
    margin-left: ${theme.s1};
  }
  .calc-btn {
    width: ${calcBtnSize};
    height: ${calcBtnSize};
    padding: 0;
    ${ccs.coloring.button.varbSelector};
  }
`;
