import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { VarbLabel } from "../../../../../../appWide/VarbLabel";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";

type Props = { feId: string };
export function ArvEditor({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  const arvInfo = property.varbInfoNext("afterRepairValue");
  return (
    <NumObjEntityEditor
      inputMargins
      editorType="equation"
      feVarbInfo={arvInfo}
      quickViewVarbNames={["purchasePrice", "rehabCost"]}
      label={<VarbLabel names={arvInfo} />}
      sx={{
        "& .DraftEditor-root": {
          minWidth: 145,
        },
      }}
    />
  );
}
