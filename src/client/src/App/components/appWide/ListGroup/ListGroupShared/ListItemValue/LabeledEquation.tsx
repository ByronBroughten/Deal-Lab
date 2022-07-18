import { FeInfoByType } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { MaterialStringEditor } from "../../../../inputs/MaterialStringEditor";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

type Props = { feInfo: FeInfoByType<"varbListItem">; endAdornment?: string };
export default function LabeledEquation({ feInfo, endAdornment }: Props) {
  const section = useGetterSection(feInfo);
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditor
          feVarbInfo={section.varbInfo("displayNameEditor")}
        />
      </td>
      <td className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">
          <NumObjEntityEditor
            feVarbInfo={section.varbInfo("numObjEditor")}
            className="cost"
            labeled={false}
            endAdornment={endAdornment}
          />
        </div>
      </td>
    </>
  );
}
