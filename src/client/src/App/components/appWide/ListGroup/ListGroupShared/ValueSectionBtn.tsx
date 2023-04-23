import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { StandardBtnProps } from "../../../general/StandardProps";
import { SectionBtn } from "../../SectionBtn";

interface BtnProps extends StandardBtnProps {
  text?: React.ReactNode;
  icon?: React.ReactNode;
}

export function ValueSectionBtn({ className, text, ...props }: BtnProps) {
  return (
    <BtnStyled
      middle={text}
      className={`ValueSectionBtn-root ${className ?? ""}`}
      sx={{}}
      {...props}
    />
  );
}

const BtnStyled = styled(SectionBtn)`
  white-space: normal;
  font-size: 18px;
  height: ${theme.valueSectionSize};
  background: ${theme.light};
  border-radius: ${theme.br0};
  padding: ${theme.sectionPadding};
`;
