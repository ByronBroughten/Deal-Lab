import { useAnalyzerContext } from "../../../../modules/usePropertyAnalyzer";
import { FeNameInfo } from "../../../../sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../../../sharedWithServer/SectionsMeta/SectionName";

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
