import styled from "styled-components";
import theme from "../../theme/Theme";

export const FormSection = styled.div`
  display: flex;
  margin-top: ${theme.s35};
  padding: ${theme.s2};
  padding-top: ${theme.s35};
  padding-bottom: ${theme.s3};
  ${theme.sectionBorderChunk};
`;
