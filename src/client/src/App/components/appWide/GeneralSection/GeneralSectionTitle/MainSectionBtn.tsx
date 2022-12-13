import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { StandardBtnProps } from "../../../general/StandardProps";
import { HollowBtn } from "../../HollowBtn";

interface Props extends StandardBtnProps {
  text: string | React.ReactElement;
  icon?: React.ReactElement;
}
export function MainSectionBtn({ className, text, icon, ...props }: Props) {
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
  display: flex;
  align-items: center;
  background-color: ${theme.light};
  border: none;
  padding: ${theme.s4};
  border-radius: ${theme.br0};
  box-shadow: ${theme.boxShadow1};
  font-size: ${theme.titleSize};
  height: 80px;
  width: 100%;

  .MainSectionTitleBtn-icon {
    display: flex;
    align-items: center;
    margin-left: ${theme.s3};
  }
`;
