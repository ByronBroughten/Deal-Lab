import { isEqual } from "lodash";
import React from "react";
import { VariableOption } from "../../sharedWithServer/Analyzer/methods/get/variableOptions";
import { InEntityVarbInfo } from "../../sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import { VarbStringInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { useVariableSections } from "../../sharedWithServer/StateHooks/useVariableOptions";
import VarbAutoComplete from "./VarbAutoComplete";

type Props = {
  selectedVarbInfo: InEntityVarbInfo | VarbStringInfo;
  onSelect: (value: VariableOption) => void;
};
export function ControlledVarbAutoComplete({
  selectedVarbInfo,
  ...props
}: Props) {
  const variableSections = useVariableSections();
  const options = variableSections.variableOptions();
  const value = React.useMemo(() => {
    return options.find((option) => isEqual(option.varbInfo, selectedVarbInfo));
  }, [selectedVarbInfo, variableSections]);
  return (
    <VarbAutoComplete {...{ value, options, clearOnBlur: false, ...props }} />
  );
}
