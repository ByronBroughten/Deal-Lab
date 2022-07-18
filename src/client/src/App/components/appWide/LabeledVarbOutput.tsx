import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { LoadedVarb } from "./LoadedVarb";

export function LabeledVarbOutput({ feId }: { feId: string }) {
  const outputItem = useSetterSection({
    sectionName: "outputItem",
    feId,
  });

  const entityVarbInfo = outputItem.get.value(
    "valueEntityInfo",
    "inEntityInfoValue"
  );
  if (entityVarbInfo === null) throw new Error("Value not initialized");

  const props = {
    feInfo: outputItem.feInfo,
    onXBtnClick: () => outputItem.removeSelf(),
  } as const;

  return <LoadedVarb {...props} />;
  // outputItem.allSections.hasSectionMixed(entityVarbInfo) ? (
  //   <LoadedVarb {...props} />
  // ) : (
  //   <LoadedVarbNotFound {...props} />
  // );
}
