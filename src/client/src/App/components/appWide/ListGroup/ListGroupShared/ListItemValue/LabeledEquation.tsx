import { FeInfoByType } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { MaterialStringEditorNext } from "../../../../inputs/MaterialStringEditorNext";
import { NumObjEditorNext } from "../../../../inputs/NumObjEditorNext";

type Props = { feInfo: FeInfoByType<"varbListItem">; endAdornment?: string };
export default function LabeledEquation({ feInfo, endAdornment }: Props) {
  const section = useGetterSection(feInfo);
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditorNext feVarbInfo={section.varbInfo("name")} />
      </td>
      <td className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">
          <NumObjEditorNext
            feVarbInfo={section.varbInfo("editorValue")}
            className="cost"
            labeled={false}
            endAdornment={endAdornment}
          />
        </div>
      </td>
    </>
  );
}
