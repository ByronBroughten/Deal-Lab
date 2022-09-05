import { Button } from "@material-ui/core";
import { rem } from "polished";
import styled from "styled-components";
import theme, { ThemeName } from "../../../../../theme/Theme";
import { StandardBtnProps } from "../../../../general/StandardProps";

interface Props extends StandardBtnProps {
  themeName: ThemeName;
}
export default function ListMenuBtn({ className, themeName, ...props }: Props) {
  return (
    <Styled
      {...{
        $themeName: themeName,
        className: "ListMenuBtn-root " + className,
        ...props,
      }}
    />
  );
}

const Styled = styled(Button)<{ $themeName: ThemeName }>`
  font-size: 0.8rem;
  padding: ${rem("2px")} ${rem("4px")};
  box-shadow: ${theme.boxShadow1};
  border-radius: ${theme.br1};
  line-height: 1rem;
  background-color: ${theme["gray-300"]};
  color: ${theme.dark};
  :hover {
    background-color: ${theme["gray-600"]};
    color: ${theme.light};
  }
`;
