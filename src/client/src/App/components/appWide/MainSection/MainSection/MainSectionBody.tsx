import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { listGroupCss } from "../../../AnalyzerMain/general/ListGroup";

export default function MainSectionBody({ children }: { children: any }) {
  return (
    <StyledEntryBody className="MainSectionBody-root">
      <div className="MainSectionBody-inner">{children}</div>
    </StyledEntryBody>
  );
}

const StyledEntryBody = styled.div`
  display: flex;
  flex: 0;
  flex-wrap: wrap;

  ${listGroupCss};

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
