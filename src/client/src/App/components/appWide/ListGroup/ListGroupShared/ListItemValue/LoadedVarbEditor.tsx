import { VarbNameNext } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionTypes";
import { inEntityInfo } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsVarbs/baseValues/InEntityInfoValue";
import { FeSectionInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VariableOption } from "../../../../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import { ControlledVarbAutoComplete } from "../../../../inputs/ControlledVarbAutoComplete";

interface Props<SN extends SectionNameByType<"varbListItem">> {
  feInfo: FeSectionInfo<SN>;
  valueVarbName: VarbNameNext<SN>;
}
export function LoadedVarbEditor<SN extends SectionNameByType<"varbListItem">>({
  feInfo,
  valueVarbName,
}: Props<SN>) {
  const section = useSetterSection(feInfo);
  const infoVarb = section.varb("valueEntityInfo");
  function onSelect({ varbInfo }: VariableOption) {
    infoVarb.updateValue(inEntityInfo(varbInfo));
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
