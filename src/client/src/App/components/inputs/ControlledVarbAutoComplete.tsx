import { isEqual, omit } from "lodash";
import React from "react";
import { InEntityInfoValue } from "../../sharedWithServer/SectionsMeta/baseSectionsUtils/baseValues/InEntityInfoValue";
import { useVariableSections } from "../../sharedWithServer/stateClassHooks/useVariableOptions";
import { VariableOption } from "../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import VarbAutoComplete from "./VarbAutoComplete";

type Props = {
  selectedVarbInfo: InEntityInfoValue;
  onSelect: (value: VariableOption) => void;
};
export function ControlledVarbAutoComplete({
  selectedVarbInfo,
  ...props
}: Props) {
  const variableSections = useVariableSections();
  const options = variableSections.variableOptions();
  const value = React.useMemo(() => {
    const toFind = selectedVarbInfo
      ? omit(selectedVarbInfo, ["entityId"])
      : null;
    return options.find((option) => isEqual(option.varbInfo, toFind));
  }, [selectedVarbInfo, options]);
  return (
    <VarbAutoComplete {...{ value, options, clearOnBlur: false, ...props }} />
  );
}
