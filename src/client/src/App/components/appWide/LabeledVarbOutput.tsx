import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { LabeledVarbNext, LabeledVarbNotFound } from "./LabeledVarb";

export function LabeledVarbOutput({ feId }: { feId: string }) {
  const output = useSetterSection({
    sectionName: "output",
    feId,
  });

  const entityVarbInfo = output.get.value(
    "valueEntityInfo",
    "inEntityVarbInfo"
  );
  if (entityVarbInfo === null) throw new Error("Value not initialized");

  const props = {
    entityVarbInfo,
    onXBtnClick: () => output.removeSelf(),
  } as const;

  return output.allSections.hasSectionMixed(entityVarbInfo) ? (
    <LabeledVarbNext {...props} />
  ) : (
    <LabeledVarbNotFound {...props} />
  );
}
