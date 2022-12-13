import styled from "styled-components";
import theme, { ThemeName } from "../../../../theme/Theme";
import { StandardBtnProps } from "../../../general/StandardProps";
import { HollowBtn } from "../../HollowBtn";

interface Props extends StandardBtnProps {
  themeName: ThemeName;
  text: string | React.ReactElement;
  icon?: React.ReactElement;
}
export default function MainSectionTitleBtn({
  className,
  text,
  icon,
  ...props
}: Props) {
  return (
    <Styled
      {...{ className: `GeneralSectionTitle-btn ${className ?? ""}`, ...props }}
    >
      <span className="MainSectionTitleBtn-text">{text}</span>
      {icon && <span className="MainSectionTitleBtn-icon">{icon}</span>}
    </Styled>
  );
}
const Styled = styled(HollowBtn)`
  min-height: 50px;
  min-width: 300px;
  color: inherit;
  display: flex;
  align-items: center;
  .MainSectionTitleBtn-text {
  }
  .MainSectionTitleBtn-icon {
    display: flex;
    align-items: center;
    margin-left: ${theme.s3};
  }
`;
