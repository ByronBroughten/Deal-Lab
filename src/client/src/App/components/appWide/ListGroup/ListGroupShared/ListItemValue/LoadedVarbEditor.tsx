import { VarbName } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { inEntityIdInfo } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsVarbs/baseValues/InEntityIdInfoValue";
import { FeSectionInfo } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VariableOption } from "../../../../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import { ControlledVarbAutoComplete } from "../../../../inputs/ControlledVarbAutoComplete";

interface Props<SN extends SectionNameByType<"varbListItem">> {
  feInfo: FeSectionInfo<SN>;
  valueVarbName: VarbName<SN>;
}
export function LoadedVarbEditor<SN extends SectionNameByType<"varbListItem">>({
  feInfo,
  valueVarbName,
}: Props<SN>) {
  const section = useSetterSection(feInfo);
  const infoVarb = section.varb("valueEntityInfo");
  function onSelect({ varbInfo }: VariableOption) {
    infoVarb.updateValue(inEntityIdInfo(varbInfo));
  }
  const selectedVarbInfo = infoVarb.value("inEntityInfo");
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
