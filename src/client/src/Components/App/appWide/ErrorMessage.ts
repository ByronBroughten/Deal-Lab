import { lighten } from "polished";
import styled from "styled-components";

const ErrorMessage = styled.small.attrs(({ className }) => ({
  className: "error-message " + className,
}))`
  display: flex;
  align-items: flex-start;

  padding: 0.125rem;
  max-width: 160px;
  line-height: 0.9rem;

  border: 1px solid ${({ theme }) => theme.danger};
  border-top: none;
  border-radius: 0 0 0.2rem 0.2rem;

  color: ${({ theme }) => theme.danger};
  background-color: ${({ theme }) => lighten(0.4, theme.danger)};
`;
export default ErrorMessage;
