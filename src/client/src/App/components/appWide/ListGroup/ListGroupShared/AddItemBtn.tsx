import styled from "styled-components";
import { StandardBtnProps } from "../../../general/StandardProps";
import { SectionBtn } from "../../SectionBtn";

export function AddItemBtn({ className, ...props }: StandardBtnProps) {
  return (
    <Styled
      className={`AdditiveListTable-addItemBtn ${className ?? ""}`}
      {...props}
      middle="+"
    />
  );
}

const Styled = styled(SectionBtn)`
  font-size: 18px;
  font-weight: bold;
  height: 25px;
  box-shadow: none;
  width: 100%;
`;

// width: 100%;
// color: ${theme.light};
// background: ${theme.primaryNext};
