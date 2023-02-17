import React from "react";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useSetterVarb } from "../../sharedWithServer/stateClassHooks/useSetterVarb";
import { CheckboxStyled } from "../general/CheckboxStyled";

interface Props extends FeVarbInfo {
  className?: string;
}
export const ToggleValueCheckbox = React.memo(function UpdateValueNextBtn({
  className,
  ...feVarbInfo
}: Props) {
  const varb = useSetterVarb(feVarbInfo);
  return (
    <CheckboxStyled
      {...{
        className,
        onChange: () => varb.toggleValue(),
        checked: varb.value("boolean"),
        name: varb.varbName,
      }}
    />
  );
});
