import { useSetterSection } from "../../sharedWithServer/StateHooks/useSetterSection";
import { LabeledVarbNext, LabeledVarbNotFound } from "./LabeledVarbNext";

export function LabeledVarbOutput({ feId }: { feId: string }) {
  const output = useSetterSection({
    sectionName: "output",
    feId,
  });
  const { varbInfoValues: entityVarbInfo } = output.get.varbs;
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
