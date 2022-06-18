import { ControlledVarbAutoComplete } from "../../../../App/components/inputs/ControlledVarbAutoComplete";
import { FeVarbInfo } from "../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { VariableOption } from "../../../modules/Analyzer/methods/get/variableOptions";
import { useAnalyzerContext } from "../../usePropertyAnalyzer";

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
