import styled from "styled-components";
import SectionBtn from "./../../SectionBtn";
import { StandardBtnProps } from "../../../general/StandardProps";
import theme from "../../../../theme/Theme";
// Do I call the theme from the styled component, or do I pass in a sectionName?

export default function MainSectionTitleBtn({
  className,
  ...props
}: StandardBtnProps) {
  return (
    <Styled
      {...{ className: `MainSectionTitle-btn ${className ?? ""}`, ...props }}
    />
  );
}
const Styled = styled(SectionBtn)`
  height: 90%;
  background-color: ${({ theme }) => theme.section.light};
  :hover {
    background-color: ${({ theme }) => theme.section.border};
    color: ${theme.light};
  }
`;
