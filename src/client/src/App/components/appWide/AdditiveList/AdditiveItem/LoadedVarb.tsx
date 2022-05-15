import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import { VariableOption } from "../../../../sharedWithServer/Analyzer/methods/get/variableOptions";
import { FeVarbInfo } from "../../../../sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ControlledVarbAutoComplete } from "../../../inputs/ControlledVarbAutoComplete";

export default function LoadedVarb({ feVarbInfo }: { feVarbInfo: FeVarbInfo }) {
  const { handleSet, analyzer } = useAnalyzerContext();
  function onSelect({ varbInfo }: VariableOption) {
    handleSet("loadValueFromVarb", feVarbInfo, varbInfo);
  }
  const varb = analyzer.varb(feVarbInfo);
  const selectedVarbInfo = analyzer.varbInfoValues(feVarbInfo);
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <ControlledVarbAutoComplete {...{ selectedVarbInfo, onSelect }} />
      </td>
      <td className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">{`${varb.displayVarb()}`}</div>
      </td>
    </>
  );
}
