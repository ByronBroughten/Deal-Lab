import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { StandardBtnProps } from "../../../general/StandardProps";
import { SectionBtn } from "../../SectionBtn";

interface BtnProps extends StandardBtnProps {
  text?: React.ReactNode;
  icon?: React.ReactNode;
}

export function SubSectionGroupBtn({ className, ...props }: BtnProps) {
  return (
    <BtnStyled className={`ListGroup-root ${className ?? ""}`} {...props} />
  );
}

const BtnStyled = styled(SectionBtn)`
  ${theme.sectionBorderChunk};
  padding: ${theme.sectionPadding};
  height: 260px;
  width: 200px;
  font-size: ${theme.titleSize};
`;
