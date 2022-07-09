import { isEqual } from "lodash";
import React from "react";
import { InEntityVarbInfoValue } from "../../sharedWithServer/SectionsMeta/baseSectionsUtils/baseValues/InEntityVarbInfoValue";
import { useVariableSections } from "../../sharedWithServer/stateClassHooks/useVariableOptions";
import { VariableOption } from "../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import VarbAutoComplete from "./VarbAutoComplete";

type Props = {
  selectedVarbInfo: InEntityVarbInfoValue;
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
