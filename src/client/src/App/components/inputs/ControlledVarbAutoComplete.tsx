import { isEqual } from "lodash";
import React from "react";
import { InEntityVarbInfo } from "../../sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import { VarbStringInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { useVariableSections } from "../../sharedWithServer/stateClassHooks/useVariableOptions";
import { VariableOption } from "../../sharedWithServer/StateEntityGetters/VariableGetterSections";
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
  }, [selectedVarbInfo, options]);
  return (
    <VarbAutoComplete {...{ value, options, clearOnBlur: false, ...props }} />
  );
}
