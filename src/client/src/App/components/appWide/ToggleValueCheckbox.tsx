import React from "react";
import { FeVarbInfo } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { useAction } from "../../stateClassHooks/useAction";
import { useGetterVarb } from "../../stateClassHooks/useGetterVarb";
import { CheckboxStyled } from "../general/CheckboxStyled";

interface Props extends FeVarbInfo {
  className?: string;
}
export const ToggleValueCheckbox = React.memo(function UpdateValueNextBtn({
  className,
  ...feVarbInfo
}: Props) {
  const varb = useGetterVarb(feVarbInfo);
  const updateValue = useAction("updateValue");
  return (
    <CheckboxStyled
      {...{
        className,
        onChange: () =>
          updateValue({
            ...varb.feVarbInfo,
            value: !varb.value("boolean"),
          }),
        checked: varb.value("boolean"),
        name: varb.varbName,
      }}
    />
  );
});
