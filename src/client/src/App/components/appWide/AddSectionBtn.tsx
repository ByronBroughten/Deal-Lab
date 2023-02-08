import { AiOutlinePlus } from "react-icons/ai";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { StandardBtnProps } from "../general/StandardProps";
import { StyledIconBtn } from "./StyledIconBtn";

type Props = StandardBtnProps;
export function AddSectionBtn(props: Props) {
  return (
    <Styled
      className="MainDealSection-addSectionBtn"
      left={<AiOutlinePlus size={20} />}
      middle="Add"
      {...props}
    />
  );
}

const Styled = styled(StyledIconBtn)`
  padding: ${theme.s4};
  border: ${theme.borderStyle};
`;
