import useToggleView from "../../../../modules/customHooks/useToggleView";
import { Inf } from "../../../../sharedWithServer/Analyzer/SectionMetas/Info";
import { FeNameInfo } from "../../../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";
import MaterialStringEditor from "../../../inputs/MaterialStringEditor";
import IfThenContent from "./IfThen/IfThenContent";

type Props = { feInfo: FeNameInfo<"userVarbItem"> };
export default function IfThen({ feInfo }: Props) {
  const { viewIsOpen, toggleView } = useToggleView();

  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditor feVarbInfo={Inf.feVarb("name", feInfo)} />
      </td>
      <td className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">
          <IfThenContent {...{ feInfo, viewIsOpen, toggleView }} />
        </div>
      </td>
    </>
  );
}
