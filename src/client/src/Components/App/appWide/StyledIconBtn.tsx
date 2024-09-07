import styled from "styled-components";
import { nativeTheme } from "../../../theme/nativeTheme";
import theme from "../../../theme/Theme";
import { PlainIconBtn, PlainIconBtnProps } from "../../general/PlainIconBtn";

interface Props extends PlainIconBtnProps {}
export function StyledIconBtn({ sx, ...rest }: Props) {
  return (
    <Styled
      {...{
        ...rest,
        sx: {
          borderRadius: nativeTheme.muiBr0,
          padding: `${nativeTheme.s1} ${nativeTheme.s25}`,
          color: nativeTheme.primary.main,
          ...sx,
        },
      }}
    ></Styled>
  );
}

const Styled = styled(PlainIconBtn)`
  :hover {
    background: ${theme.secondary};
    color: ${theme.light};
  }
`;
