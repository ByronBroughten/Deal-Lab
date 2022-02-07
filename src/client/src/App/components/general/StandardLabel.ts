import styled from "styled-components";

export default styled.label.attrs(({ className, ...rest }) => ({
  className: "StandardLabel-root " + className,
  ...rest,
}))`
  line-height: 1;
  margin: 0;
  padding: 0;
`;
