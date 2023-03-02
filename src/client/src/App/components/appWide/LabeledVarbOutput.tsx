import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { LabeledVarb, LabeledVarbNotFound } from "./LabeledVarb";

export function LabeledVarbOutput({ feId }: { feId: string }) {
  const outputItem = useSetterSection({
    sectionName: "outputItem",
    feId,
  });
  const entityVarbInfo = outputItem.get.valueEntityInfo();
  if (outputItem.get.hasVarbByFocalMixed(entityVarbInfo)) {
    const { feVarbInfo } = outputItem.get.varbByFocalMixed(entityVarbInfo);
    return (
      <LabeledVarb
        {...{
          ...feVarbInfo,
          onXBtnClick: () => outputItem.removeSelf(),
        }}
      />
    );
  } else {
    return <LabeledVarbNotFound />;
  }
}
