import styled from "styled-components";
import { ThemeName } from "../../../../theme/Theme";
import { StandardBtnProps } from "../../../general/StandardProps";
import SectionBtn from "../../SectionBtn";
// Do I call the theme from the styled component, or do I pass in a sectionName?

export default function MainSectionTitleBtn({
  className,
  ...props
}: StandardBtnProps & { themeName: ThemeName }) {
  return (
    <Styled
      {...{ className: `GeneralSectionTitle-btn ${className ?? ""}`, ...props }}
    />
  );
}
const Styled = styled(SectionBtn)`
  height: 90%;
`;
