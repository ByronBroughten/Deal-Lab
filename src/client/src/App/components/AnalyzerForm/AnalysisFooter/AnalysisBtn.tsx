import theme from "../../../theme/Theme";
import NavBtn, { NavBtnProps } from "../../NavBar/NavBtn";
import styled from "styled-components";

type Props = NavBtnProps & {
  text: string;
  leftIcon?: any;
  rightIcon?: any;
};
export default function AnalysisBtn({
  className,
  text,
  leftIcon,
  rightIcon,
  ...rest
}: Props) {
  return (
    <Styled className={`AnalysisBtn-root ${className}`} {...rest}>
      <span className="AnalysisBtn-textRow">
        <span className="AnalysisBtn-leftIcon AnalysisBtn-Icon">
          {leftIcon}
        </span>
        <span className="AnalysisBtn-text">{text}</span>
        <span className="AnalysisBtn-rightIcon AnalysisBtn-Icon">
          {rightIcon}
        </span>
      </span>
    </Styled>
  );
}

const Styled = styled(NavBtn)`
  padding-left: ${theme.s2};
  padding-right: ${theme.s2};
  border: 1px solid ${theme.analysis.border};
  .AnalysisBtn-textRow {
    display: flex;
    align-items: center;
  }
  .AnalysisBtn-icon,
  .AnalysisBtn-text {
    padding-left: ${theme.s2};
    padding-right: ${theme.s2};
  }
`;
