import styled from "styled-components";
import theme from "../../theme/Theme";
import { icons } from "../Icons";
import { PlainIconBtn } from "./PlainIconBtn";
import { StandardBtnProps } from "./StandardProps";

type Props = StandardBtnProps;
export function TrashBtn({ className, ...rest }: Props) {
  return (
    <Styled
      {...{
        className: `TrashBtn-root ${className ?? ""}`,
        middle: icons.delete({ size: 25 }),
        ...rest,
      }}
    />
  );
}

const Styled = styled(PlainIconBtn)`
  :hover {
    color: ${theme.danger};
  }
`;
