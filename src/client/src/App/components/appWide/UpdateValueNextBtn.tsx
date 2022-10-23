import React from "react";
import { VarbValueInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { useSectionsDispatch } from "../../sharedWithServer/stateClassHooks/useSections";
import { StandardProps } from "../general/StandardProps";
import { NextBtn } from "./NextBtn";

interface Props extends StandardProps, VarbValueInfo {}
export const UpdateValueNextBtn = React.memo(function UpdateValueNextBtn({
  className,
  children,
  ...rest
}: Props) {
  const dispatch = useSectionsDispatch();
  return (
    <NextBtn
      {...{
        className,
        children,
        onClick: () => dispatch({ type: "updateValue", ...rest }),
      }}
    />
  );
});
