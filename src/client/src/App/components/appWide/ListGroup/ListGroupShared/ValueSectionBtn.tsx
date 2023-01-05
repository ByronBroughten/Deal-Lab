import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { StandardBtnProps } from "../../../general/StandardProps";
import { SectionBtn } from "../../SectionBtn";

interface BtnProps extends StandardBtnProps {
  text?: React.ReactNode;
  icon?: React.ReactNode;
}

export function ValueSectionBtn({ className, ...props }: BtnProps) {
  return (
    <BtnStyled
      className={`ValueSectionBtn-root ${className ?? ""}`}
      {...props}
    />
  );
}

const BtnStyled = styled(SectionBtn)`
  white-space: normal;
  font-size: 18px;
  height: ${theme.valueSectionSize};
  display: inline-block;
  background: ${theme.light};
  border-radius: ${theme.br0};
  padding: ${theme.sectionPadding};
`;
