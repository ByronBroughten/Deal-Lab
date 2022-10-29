import { Button } from "@material-ui/core";
import React from "react";
import styled, { css } from "styled-components";
import ccs from "../../theme/cssChunks";
import theme, { ThemeName } from "../../theme/Theme";
import { processProps } from "../../utils/component";
import { StandardBtnProps } from "../general/StandardProps";

type Props = StandardBtnProps & {
  themeName?: ThemeName;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  text?: React.ReactNode;
};
export function SectionBtn({
  text,
  leftIcon,
  rightIcon,
  themeName,
  children,
  ...props
}: Props) {
  return (
    <Styled
      {...{
        variant: "contained",
        disableRipple: true,
        $themeName: themeName,
        ...processProps("SectionBtn-root", props),
      }}
    >
      {leftIcon && <span className="SectionBtn-rightIcon">{leftIcon}</span>}
      {text && <span className="SectionBtn-leftIcon">{text}</span>}
      {children}
      {rightIcon && <span className="SectionBtn-text">{rightIcon}</span>}
    </Styled>
  );
}

const sectionTheme = (themeName: ThemeName) => css`
  background-color: ${theme[themeName].light};
  :disabled {
    background-color: ${theme[themeName].light};
  }
  :hover {
    background-color: ${theme[themeName].border};
    color: ${theme.light};
  }
`;

const Styled = styled(Button)<{ $themeName?: ThemeName }>`
  height: calc(1.5em + 0.5rem + 2px);
  white-space: nowrap;

  ${({ $themeName }) =>
    $themeName
      ? sectionTheme($themeName)
      : css`
          ${ccs.coloring.section.lightNeutral};
          color: ${theme.dark};
          :hover {
            background-color: ${theme["gray-600"]};
            color: ${theme["gray-300"]};
          }
        `}

  font-weight: 700;
  color: ${theme["gray-800"]};
`;

// const SectionBtn = styled(Button).attrs(({ className, ...rest }) => ({
//   variant: "contained",
//   disableRipple: true,
//   className: "section-btn " + className,
//   ...rest,
// }))`
//   height: calc(1.5em + 0.5rem + 2px);
//   white-space: nowrap;

//   ${ccs.coloring.section.lightNeutral}
//   color: ${theme.dark};
//   :hover {
//     background-color: ${theme["gray-600"]};
//     color: ${theme["gray-300"]};
//   }
//   font-weight: 700;
//   color: ${theme["gray-800"]};
// `;

// export default SectionBtn;
