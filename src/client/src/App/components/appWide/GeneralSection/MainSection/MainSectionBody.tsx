import styled from "styled-components";
import theme, { ThemeName } from "../../../../theme/Theme";
import { listGroupCss } from "../../ListGroup/ListGroupShared/ListGroupGeneric";

export default function MainSectionBody({
  children,
  themeName,
}: {
  children: any;
  themeName: ThemeName;
}) {
  return (
    <StyledEntryBody className="MainSectionBody-root" $themeName={themeName}>
      <div className="MainSectionBody-inner">{children}</div>
    </StyledEntryBody>
  );
}

const StyledEntryBody = styled.div<{ $themeName: ThemeName }>`
  display: flex;
  flex: 0;
  flex-wrap: wrap;

  ${({ $themeName }) => listGroupCss($themeName)};

  .MainSectionBody-inner {
    display: flex;
    flex-wrap: wrap;
  }
  .MainEntryItem {
  }
  .ListGroup-root {
    margin: ${theme.s2};
  }
`;
