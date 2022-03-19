import styled, { css } from "styled-components";
import { Button } from "@material-ui/core";
import theme, { ThemeSectionName } from "../../theme/Theme";
import ccs from "../../theme/cssChunks";
import { StandardBtnProps } from "../general/StandardProps";
import { processProps } from "../../utils/component";

type Props = StandardBtnProps & { themeName?: ThemeSectionName };
export default function SectionBtn({ themeName, ...props }: Props) {
  return (
    <Styled
      {...{
        variant: "contained",
        disableRipple: true,
        $themeName: themeName,
        ...processProps("SectionBtn-root", props),
      }}
    ></Styled>
  );
}

const sectionTheme = (themeName: ThemeSectionName) => css`
  background-color: ${theme[themeName].light};
  :disabled {
    background-color: ${theme[themeName].light};
  }
  :hover {
    background-color: ${theme[themeName].border};
    color: ${theme.light};
  }
`;

const Styled = styled(Button)<{ $themeName?: ThemeSectionName }>`
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
