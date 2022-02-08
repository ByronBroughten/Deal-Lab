import styled from "styled-components";
import theme from "../../../../theme/Theme";

export default function MainEntryBody({ children }: { children: any }) {
  return (
    <StyledEntryBody className="MainEntryBody-root">
      <div className="MainEntryBody-inner">{children}</div>
    </StyledEntryBody>
  );
}

const StyledEntryBody = styled.div`
  display: flex;
  flex: 0;
  flex-wrap: wrap;

  .MainEntryBody-inner {
    display: flex;
    flex-wrap: wrap;
  }
  .MainEntryItem {
  }
  .ListGroup-root {
    margin: ${theme.s2};
  }
`;
