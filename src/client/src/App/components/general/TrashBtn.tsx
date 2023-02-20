import { MdDelete } from "react-icons/md";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { PlainIconBtn } from "./PlainIconBtn";
import { StandardBtnProps } from "./StandardProps";

type Props = StandardBtnProps;
export function TrashBtn({ className, ...rest }: Props) {
  return (
    <Styled
      {...{
        className: `TrashBtn-root ${className ?? ""}`,
        middle: <MdDelete size={25} className="TrashBtn-icon" />,
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
