import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import { MuiBtnPropsNext } from "../../../../general/StandardProps";
import { SectionBtn } from "../../SectionBtn";

interface Props extends MuiBtnPropsNext {
  middle?: React.ReactNode;
}
export function AddItemBtn({
  sx,
  middle = <AiOutlinePlus size={20} />,
  ...rest
}: Props) {
  return (
    <SectionBtn
      {...{
        ...rest,
        middle,
        sx: {
          height: 30,
          fontSize: nativeTheme.fs16,
          width: "100%",
          ...sx,
        },
      }}
    />
  );
}
