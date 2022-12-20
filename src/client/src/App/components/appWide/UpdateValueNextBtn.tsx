import React from "react";
import { FeVarbValueInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useUpdateValue } from "../../sharedWithServer/stateClassHooks/useReduceActions";
import { StandardProps } from "../general/StandardProps";
import { NextBtn } from "./NextBtn";

interface Props extends StandardProps, FeVarbValueInfo {}
export const UpdateValueNextBtn = React.memo(function UpdateValueNextBtn({
  className,
  children,
  ...rest
}: Props) {
  const updateValue = useUpdateValue();
  return (
    <NextBtn
      {...{
        className,
        children,
        onClick: () => updateValue(rest),
      }}
    />
  );
});
