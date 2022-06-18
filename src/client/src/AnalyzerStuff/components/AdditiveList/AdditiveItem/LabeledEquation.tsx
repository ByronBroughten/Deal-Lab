import {
  FeInfo,
  InfoS,
} from "../../../../App/sharedWithServer/SectionsMeta/Info";
import MaterialStringEditor from "../../MaterialStringEditor";
import NumObjEditor from "../../NumObjEditor";

type Props = { feInfo: FeInfo };
export default function LabeledEquation({ feInfo }: Props) {
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditor feVarbInfo={InfoS.feVarb("name", feInfo)} />
      </td>
      <td className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">
          <NumObjEditor
            feVarbInfo={InfoS.feVarb("editorValue", feInfo)}
            className="cost"
            labeled={false}
          />
        </div>
      </td>
    </>
  );
}
