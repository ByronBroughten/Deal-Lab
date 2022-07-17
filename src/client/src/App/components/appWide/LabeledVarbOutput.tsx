import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { LabeledVarbNext, LabeledVarbNotFound } from "./LabeledVarb";

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
    entityVarbInfo,
    onXBtnClick: () => outputItem.removeSelf(),
  } as const;

  return outputItem.allSections.hasSectionMixed(entityVarbInfo) ? (
    <LabeledVarbNext {...props} />
  ) : (
    <LabeledVarbNotFound {...props} />
  );
}
