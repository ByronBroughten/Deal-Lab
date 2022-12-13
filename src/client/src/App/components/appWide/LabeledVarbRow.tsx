import styled from "styled-components";
import theme, { ThemeName } from "../../theme/Theme";
import { StandardProps } from "../general/StandardProps";

interface Props extends StandardProps {
  themeName: ThemeName;
}
export default function LabeledVarbRow({
  className,
  children,
  themeName,
}: Props) {
  return (
    <Styled
      {...{
        $themeName: themeName,
        className: `LabeledVarbRow-root ${className}`,
      }}
    >
      {children}
    </Styled>
  );
}

const Styled = styled.div<{ $themeName: ThemeName }>`
  background: ${({ $themeName }) => theme[$themeName].main};
  display: flex;
  flex-wrap: wrap;
  border-radius: ${theme.br0};

  padding-left: ${theme.s15};
  padding-right: ${theme.s15};
  .LabeledVarb-root {
    margin: ${theme.s25} ${theme.s15};
  }
  .LabeledVarb-label {
    font-size: 1.05rem;
  }
  .LabeledVarb-output {
    font-size: 1.05rem;
  }
`;
