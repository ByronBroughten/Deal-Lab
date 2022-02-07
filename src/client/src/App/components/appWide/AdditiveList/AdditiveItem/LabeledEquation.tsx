import {
  FeInfo,
  Inf,
} from "../../../../sharedWithServer/Analyzer/SectionMetas/Info";

import MaterialStringEditor from "../../../inputs/MaterialStringEditor";
import NumObjEditor from "../../../inputs/NumObjEditor";

type Props = { feInfo: FeInfo };
export default function LabeledEquation({ feInfo }: Props) {
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditor feVarbInfo={Inf.feVarb("name", feInfo)} />
      </td>
      <td className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">
          <NumObjEditor
            feVarbInfo={Inf.feVarb("editorValue", feInfo)}
            className="cost"
            labeled={false}
          />
        </div>
      </td>
    </>
  );
}
