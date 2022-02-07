import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import { FeNameInfo } from "../../../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { ChildName } from "../../../../sharedWithServer/Analyzer/SectionMetas/relSectionTypes";
import { SectionName } from "../../../../sharedWithServer/Analyzer/SectionMetas/SectionName";

export default function useAddListItem<S extends SectionName<"allList">>(
  feInfo: FeNameInfo<S>,
  itemType: ChildName<S>
) {
  const { analyzer, handleAddSection } = useAnalyzerContext();
  const defaultValueSwitch = analyzer.feValue(
    "defaultValueSwitch",
    feInfo,
    "string"
  );
  const addItem = () =>
    handleAddSection(itemType, feInfo, {
      values: { valueSwitch: defaultValueSwitch },
    });
  return addItem;
}
