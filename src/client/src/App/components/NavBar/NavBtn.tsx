import { ButtonProps } from "@material-ui/core/Button";
import theme from "../../theme/Theme";
import PlainBtn from "../general/PlainBtn";
import styled, { css } from "styled-components";

export type NavBtnProps = ButtonProps & {
  $isactive?: boolean;
  target?: string;
};
export default function NavBtn({ className, ...rest }: NavBtnProps) {
  return (
    <Styled
      {...{
        className: `NavBtn ${className}`,
        disableRipple: true,
        ...rest,
        // title: "Test title",
      }}
    />
  );
}
const Styled = styled(PlainBtn)<{ $isactive?: boolean }>`
  font-size: 1em;
  padding: 0 ${theme.s4};
  display: flex;
  flex-direction: column;

  flex: 1;
  white-space: nowrap;
  background-color: ${theme.analysis.main};

  :hover {
    box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.5);
    color: ${theme.light};
    background-color: ${theme.analysis.main};
  }

  ${({ $isactive }) =>
    $isactive &&
    css`
      box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.5);
      color: ${theme.light};
      background-color: ${theme.analysis.main};

      /* background-color: ${theme.navBar.activeBtn};
      border-bottom: none;
      color: ${theme.primary}; */
    `};
`;
