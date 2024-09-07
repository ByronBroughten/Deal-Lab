import { AiOutlineClose } from "react-icons/ai";
import { nativeTheme } from "../../../theme/nativeTheme";
import { arrSx } from "../../../utils/mui";
import { PlainIconBtn } from "../../general/PlainIconBtn";
import { MuiBtnPropsNext } from "../../general/StandardProps";

interface Props extends MuiBtnPropsNext {}
export function XBtn({ children, className, sx, ...rest }: Props) {
  return (
    <PlainIconBtn
      {...{
        ...rest,
        className: "XBtn " + className ?? "",
        middle: children || (
          <AiOutlineClose className="XBtn-closeIcon" size={15} />
        ),
        sx: [
          {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: nativeTheme["gray-800"],
            borderRadius: "100%",
            whiteSpace: "nowrap",
            padding: "3px",
            "&:hover": {
              backgroundColor: nativeTheme.danger.main,
              color: nativeTheme.light,
              "& .XBtn-closeIcon": {
                color: nativeTheme.light,
              },
            },
            "& .MuiTouchRipple-root": {
              visibility: "hidden",
            },
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}
