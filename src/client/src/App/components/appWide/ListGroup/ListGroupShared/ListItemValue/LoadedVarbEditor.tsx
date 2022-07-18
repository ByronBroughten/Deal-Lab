import { inEntityInfoValue } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsUtils/baseValues/InEntityVarbInfoValue";
import { FeSectionInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VariableOption } from "../../../../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import { ControlledVarbAutoComplete } from "../../../../inputs/ControlledVarbAutoComplete";

interface Props {
  valueVarbName: string;
  feInfo: FeSectionInfo;
}
export function LoadedVarbEditor({ feInfo, valueVarbName }: Props) {
  const section = useSetterSection(feInfo);
  const infoVarb = section.varb("valueEntityInfo");
  function onSelect({ varbInfo }: VariableOption) {
    infoVarb.updateValueDirectly(inEntityInfoValue(varbInfo));
  }
  const selectedVarbInfo = infoVarb.value("inEntityInfoValue");
  const valueVarb = section.varb(valueVarbName);
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <ControlledVarbAutoComplete {...{ selectedVarbInfo, onSelect }} />
      </td>
      <td className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">{`${valueVarb.get.displayVarb()}`}</div>
      </td>
    </>
  );
}
