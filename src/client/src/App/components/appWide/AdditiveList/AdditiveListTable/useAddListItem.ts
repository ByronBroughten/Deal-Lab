import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import { FeNameInfo } from "../../../../sharedWithServer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { ChildName } from "../../../../sharedWithServer/SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../../../sharedWithServer/SectionMetas/SectionName";

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
