import { ButtonProps } from "@material-ui/core/Button";
import { rem } from "polished";
import styled, { css } from "styled-components";
import theme from "../../theme/Theme";
import PlainBtn from "../general/PlainBtn";

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
  font-size: ${rem("16px")};
  padding: 0 ${theme.s4};
  display: flex;
  flex-direction: column;

  flex: 1;
  white-space: nowrap;
  background-color: ${theme.deal.main};
  font-weight: 700;

  :hover {
    box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.5);
    color: ${theme.light};
    background-color: ${theme.deal.main};
  }

  ${({ $isactive }) =>
    $isactive &&
    css`
      box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.5);
      color: ${theme.light};
      background-color: ${theme.deal.main};
    `};
`;
