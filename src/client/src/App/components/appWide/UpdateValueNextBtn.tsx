import React from "react";
import { FeVarbValueInfo } from "../../../sharedWithServer/SectionInfos/FeInfo";
import { useAction } from "../../stateClassHooks/useAction";
import { StandardProps } from "../general/StandardProps";
import { NextBtn } from "./NextBtn";

interface Props extends StandardProps, FeVarbValueInfo {}
export const UpdateValueNextBtn = React.memo(function UpdateValueNextBtn({
  className,
  children,
  ...rest
}: Props) {
  const updateValue = useAction("updateValue");
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
