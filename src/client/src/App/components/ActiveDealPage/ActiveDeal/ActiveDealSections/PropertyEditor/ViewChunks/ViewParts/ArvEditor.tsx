import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";

type Props = { feId: string };
export function ArvEditor({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  const arvInfo = property.varbInfoNext("afterRepairValueEditor");
  return (
    <NumObjEntityEditor
      inputMargins
      editorType="equation"
      feVarbInfo={arvInfo}
      quickViewVarbNames={["purchasePrice", "rehabCost"]}
      sx={{
        "& .DraftEditor-root": {
          minWidth: 145,
        },
      }}
    />
  );
}
