import styled from "styled-components";

export default function MainEntryBody({ children }: { children: any }) {
  return (
    <StyledEntryBody className="main-entry-body">
      <div className="main-entry-body-inner">{children}</div>
    </StyledEntryBody>
  );
}

const StyledEntryBody = styled.div`
  display: flex;
  flex: 0;
  flex-wrap: wrap;

  .main-entry-body-inner {
    display: flex;
    flex-wrap: wrap;
  }
`;
