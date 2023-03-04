import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";
import { nativeTheme } from "../../theme/nativeTheme";
import theme from "../../theme/Theme";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { NativeBtnProps } from "../general/StandardProps";

export function XBtn({ children, className, style, ...rest }: NativeBtnProps) {
  return (
    <Styled
      {...{
        className: "XBtn " + className ?? "",
        middle: children || (
          <AiOutlineClose className="XBtn-closeIcon" size={15} />
        ),
        style: {
          padding: 3,
          color: nativeTheme["gray-800"],
          borderRadius: "100%",
          whiteSpace: "nowrap",
          ...style,
        },
        ...rest,
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
