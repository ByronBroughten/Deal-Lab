import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { LoadedVarb } from "./LabeledVarb";

export function LabeledVarbOutput({ feId }: { feId: string }) {
  const outputItem = useSetterSection({
    sectionName: "outputItem",
    feId,
  });

  const entityVarbInfo = outputItem.get.value(
    "valueEntityInfo",
    "inEntityValue"
  );
  if (entityVarbInfo === null) throw new Error("Value not initialized");
  return (
    <LoadedVarb
      {...{
        feInfo: outputItem.feInfo,
        onXBtnClick: () => outputItem.removeSelf(),
      }}
    />
  );

  // outputItem.allSections.hasSectionMixed(entityVarbInfo) ? (
  //   <LoadedVarb {...props} />
  // ) : (
  //   <LabeledVarbNotFound {...props} />
  // );
}
