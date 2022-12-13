import styled from "styled-components";
import { ThemeName } from "../../../../theme/Theme";

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

  .MainSectionBody-inner {
    display: flex;
    flex-wrap: wrap;
  }
`;
