import { FaPlay } from "react-icons/fa";
import styled from "styled-components";
import theme from "../../../theme/Theme";
import { StandardBtnProps } from "../../general/StandardProps";
import { StyledIconBtn } from "./StyledIconBtn";

type Props = StandardBtnProps;
export function StartSectionBtn(props: Props) {
  return (
    <Styled
      className="MainSubSection-addSectionBtn"
      right={<FaPlay className="StartSectionBtn-playIcon" />}
      middle="Start"
      {...props}
    />
  );
}

const Styled = styled(StyledIconBtn)`
  padding: ${theme.s4};
  border: ${theme.borderStyle};
  .StartSectionBtn-playIcon {
    margin-left: ${theme.s15};
  }
`;
