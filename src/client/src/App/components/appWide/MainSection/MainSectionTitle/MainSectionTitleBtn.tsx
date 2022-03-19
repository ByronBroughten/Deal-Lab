import styled from "styled-components";
import SectionBtn from "./../../SectionBtn";
import { StandardBtnProps } from "../../../general/StandardProps";
import theme, { ThemeSectionName } from "../../../../theme/Theme";
// Do I call the theme from the styled component, or do I pass in a sectionName?

export default function MainSectionTitleBtn({
  className,
  ...props
}: StandardBtnProps & { themeName: ThemeSectionName }) {
  return (
    <Styled
      {...{ className: `MainSectionTitle-btn ${className ?? ""}`, ...props }}
    />
  );
}
const Styled = styled(SectionBtn)`
  height: 90%;
`;
