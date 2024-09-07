import styled from "styled-components";
import { ThemeName } from "../../../../../theme/Theme";

export default function MainSectionBody({
  children,
  themeName,
}: {
  children: any;
  themeName?: ThemeName;
}) {
  return (
    <StyledEntryBody className="MainSectionBody-root">
      {children}
    </StyledEntryBody>
  );
}

const StyledEntryBody = styled.div``;
