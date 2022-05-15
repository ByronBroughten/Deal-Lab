import useToggleView from "../../../../modules/customHooks/useToggleView";
import { InfoS } from "../../../../sharedWithServer/SectionsMeta/Info";
import { FeNameInfo } from "../../../../sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import MaterialStringEditor from "../../../inputs/MaterialStringEditor";
import IfThenContent from "./IfThen/IfThenContent";

type Props = { feInfo: FeNameInfo<"userVarbItem"> };
export default function IfThen({ feInfo }: Props) {
  const { viewIsOpen, toggleView } = useToggleView();

  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditor feVarbInfo={InfoS.feVarb("name", feInfo)} />
      </td>
      <td className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">
          <IfThenContent {...{ feInfo, viewIsOpen, toggleView }} />
        </div>
      </td>
    </>
  );
}
