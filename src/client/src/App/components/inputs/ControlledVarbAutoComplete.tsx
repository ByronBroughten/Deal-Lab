import { isEqual, omit } from "lodash";
import React from "react";
import { InEntityIdInfoValue } from "../../sharedWithServer/SectionsMeta/allBaseSectionVarbs/baseValues/InEntityIdInfoValue";
import { useVariableSections } from "../../sharedWithServer/stateClassHooks/useVariableOptions";
import { VariableOption } from "../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import VarbAutoComplete from "./VarbAutoComplete";

type Props = {
  selectedVarbInfo: InEntityIdInfoValue;
  onSelect: (value: VariableOption) => void;
};
export function ControlledVarbAutoComplete({
  selectedVarbInfo,
  ...props
}: Props) {
  const variableSections = useVariableSections();
  const options = variableSections.variableOptions();
  const value =
    React.useMemo(() => {
      const toFind = selectedVarbInfo
        ? omit(selectedVarbInfo, ["entityId"])
        : null;
      return options.find((option) => isEqual(option.varbInfo, toFind));
    }, [selectedVarbInfo, options]) ?? null;
  // returns null because, "The nature of the state is determined during the first render, it's considered controlled if the value is not `undefined`"
  return (
    <VarbAutoComplete {...{ value, options, clearOnBlur: false, ...props }} />
  );
}
