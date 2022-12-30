import { FeInfoByType } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { MaterialStringEditor } from "../../../../inputs/MaterialStringEditor";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

interface Props extends FeInfoByType<"varbListItem"> {
  endAdornment?: string;
  doEquals?: boolean;
}
export function LabeledEquation({
  sectionName,
  feId,
  endAdornment,
  doEquals,
}: Props) {
  const feInfo = { sectionName, feId };
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditor
          {...{
            ...feInfo,
            varbName: "displayNameEditor",
          }}
        />
      </td>
      <td className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">
          <NumObjEntityEditor
            feVarbInfo={{
              ...feInfo,
              varbName: "valueEditor",
            }}
            className="cost"
            labeled={false}
            endAdornment={endAdornment}
            doEquals={doEquals}
          />
        </div>
      </td>
    </>
  );
}
