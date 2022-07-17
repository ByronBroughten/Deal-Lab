import { FeVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterVarb } from "../../../../../sharedWithServer/stateClassHooks/useSetterVarb";
import { VariableOption } from "../../../../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import { ControlledVarbAutoComplete } from "../../../../inputs/ControlledVarbAutoComplete";

export function LoadedVarbEditor({ feVarbInfo }: { feVarbInfo: FeVarbInfo }) {
  // valueVarb
  const varb = useSetterVarb(feVarbInfo);

  function onSelect({ varbInfo }: VariableOption) {
    varb.loadValueFromVarb(varbInfo);
  }

  const { section } = varb.get;
  const selectedVarbInfo = section.value("valueEntityInfo", "inEntityVarbInfo");
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <ControlledVarbAutoComplete {...{ selectedVarbInfo, onSelect }} />
      </td>
      <td className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">{`${varb.get.displayVarb()}`}</div>
      </td>
    </>
  );
}
