import styled from "styled-components";
import theme from "../../theme/Theme";

export default function Line({ className, ...rest }: { className?: string }) {
  return <Styled {...{ className: "line " + className, ...rest }}></Styled>;
}

const Styled = styled.div`
  border: 1px solid ${theme["gray-700"]};
`;
