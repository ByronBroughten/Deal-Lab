import { FeNameInfo } from "../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ChildName } from "../../../../App/sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../../../App/sharedWithServer/SectionsMeta/SectionName";
import { useAnalyzerContext } from "../../usePropertyAnalyzer";

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
