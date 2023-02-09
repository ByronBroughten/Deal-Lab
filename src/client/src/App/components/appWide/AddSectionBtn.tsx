import { FaPlay } from "react-icons/fa";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { StandardBtnProps } from "../general/StandardProps";
import { StyledIconBtn } from "./StyledIconBtn";

type Props = StandardBtnProps;
export function AddSectionBtn(props: Props) {
  return (
    <Styled
      className="MainDealSection-addSectionBtn"
      right={<FaPlay className="AddSectionBtn-playIcon" />}
      middle="Start"
      {...props}
    />
  );
}

const Styled = styled(StyledIconBtn)`
  padding: ${theme.s4};
  border: ${theme.borderStyle};
  .AddSectionBtn-playIcon {
    margin-left: ${theme.s15};
  }
`;
