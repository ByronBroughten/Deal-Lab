import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";
import { nativeTheme } from "../../theme/nativeTheme";
import theme from "../../theme/Theme";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { MuiBtnPropsNext } from "../general/StandardProps";

interface Props extends MuiBtnPropsNext {}
export function XBtn({ children, className, sx, ...rest }: Props) {
  return (
    <Styled
      {...{
        ...rest,
        className: "XBtn " + className ?? "",
        middle: children || (
          <AiOutlineClose className="XBtn-closeIcon" size={15} />
        ),
        sx: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: nativeTheme["gray-800"],
          borderRadius: "100%",
          whiteSpace: "nowrap",
          padding: "3px",
          ...sx,
        },
      }}
    />
  );
}

const Styled = styled(PlainIconBtn)`
  :hover {
    background-color: ${theme.error.main};
    color: ${theme.light};
    .XBtn-closeIcon {
      color: ${theme.light};
    }
  }
  .MuiTouchRipple-root {
    visibility: hidden;
  }
`;
