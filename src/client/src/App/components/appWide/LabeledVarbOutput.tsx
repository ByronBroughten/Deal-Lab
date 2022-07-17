import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { LoadedVarb, LoadedVarbNotFound } from "./LoadedVarb";

export function LabeledVarbOutput({ feId }: { feId: string }) {
  const outputItem = useSetterSection({
    sectionName: "outputItem",
    feId,
  });

  const entityVarbInfo = outputItem.get.value(
    "valueEntityInfo",
    "inEntityVarbInfo"
  );
  if (entityVarbInfo === null) throw new Error("Value not initialized");

  const props = {
    feInfo: outputItem.feInfo,
    onXBtnClick: () => outputItem.removeSelf(),
  } as const;

  return outputItem.allSections.hasSectionMixed(entityVarbInfo) ? (
    <LoadedVarb {...props} />
  ) : (
    <LoadedVarbNotFound {...props} />
  );
}
