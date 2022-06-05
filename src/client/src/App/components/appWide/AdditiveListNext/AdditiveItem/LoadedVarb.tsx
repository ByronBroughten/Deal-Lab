import { VariableOption } from "../../../../sharedWithServer/Analyzer/methods/get/variableOptions";
import { VarbInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import { useGetterSection } from "../../../../sharedWithServer/StateHooks/useGetterSection";
import { useSetterVarb } from "../../../../sharedWithServer/StateHooks/useSetterVarb";
import { ControlledVarbAutoComplete } from "../../../inputs/ControlledVarbAutoComplete";

export default function LoadedVarb({ feVarbInfo }: { feVarbInfo: VarbInfo }) {
  const varb = useSetterVarb(feVarbInfo);
  function onSelect({ varbInfo }: VariableOption) {
    varb.loadValueFromVarb(varbInfo);
  }
  const section = useGetterSection(feVarbInfo);
  const selectedVarbInfo = section.varbs.varbInfoStringValues;
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
