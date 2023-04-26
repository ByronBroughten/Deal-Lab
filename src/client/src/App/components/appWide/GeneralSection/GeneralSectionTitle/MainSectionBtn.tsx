import styled from "styled-components";
import { nativeTheme } from "../../../../theme/nativeTheme";
import theme from "../../../../theme/Theme";
import { arrSx } from "../../../../utils/mui";
import { PlainIconBtn, PlainIconBtnProps } from "../../../general/PlainIconBtn";

export function MainSectionBtn({ sx, ...rest }: PlainIconBtnProps) {
  return (
    <Styled
      {...{
        ...rest,
        sx: [
          {
            borderRadius: nativeTheme.br0,
            display: "flex",
            alignItems: "center",
            backgroundColor: nativeTheme.light,
            color: nativeTheme.primary.main,
            p: nativeTheme.s4,
            boxShadow: theme.boxShadow1,
            fontSize: theme.titleSize,
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}
const Styled = styled(PlainIconBtn)`
  :hover {
    background-color: ${theme.secondary};
    color: ${theme.light};
    box-shadow: none;
  }

  .MainSectionTitleBtn-icon {
    display: flex;
    align-items: center;
    margin-left: ${theme.s3};
  }
`;
