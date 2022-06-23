import { Button } from "@material-ui/core";
import { rem } from "polished";
import styled, { css } from "styled-components";
import ccs from "../../../../../theme/cssChunks";
import theme from "../../../../../theme/Theme";
import { StandardBtnProps } from "../../../../general/StandardProps";

export default function ListMenuBtn({ className, ...props }: StandardBtnProps) {
  return (
    <Styled
      {...{
        className: "ListMenuBtn-root " + className,
        ...props,
      }}
    />
  );
}

export const listMenuBtnCss = css`
  font-size: 0.8rem;
  padding: ${rem("2px")} ${rem("4px")};
  box-shadow: ${theme.boxShadow1};
  border-radius: ${theme.br1};
  line-height: 1rem;

  ${ccs.coloring.section.lightNeutral}
  color: ${theme.dark};
  :hover {
    background-color: ${theme["gray-600"]};
    color: ${theme["gray-300"]};
  }
`;

const Styled = styled(Button)`
  ${listMenuBtnCss};
`;
