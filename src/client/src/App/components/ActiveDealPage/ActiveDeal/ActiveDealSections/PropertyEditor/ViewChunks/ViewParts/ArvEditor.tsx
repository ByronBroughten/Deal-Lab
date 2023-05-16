import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { LabelWithInfo } from "../../../../../../appWide/LabelWithInfo";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";

type Props = { feId: string };
export function ArvEditor({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <NumObjEntityEditor
      inputMargins
      editorType="equation"
      feVarbInfo={property.varbInfo("afterRepairValue")}
      quickViewVarbNames={["purchasePrice", "rehabCost"]}
      label={
        <LabelWithInfo
          {...{
            label: "After repair value",
            infoTitle: "After Repair Value",
            infoText: `This is the price that a property is sold at after repairs are made.`,
          }}
        />
      }
      sx={{
        "& .DraftEditor-root": {
          minWidth: 145,
        },
      }}
    />
  );
}
