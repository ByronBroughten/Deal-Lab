import useToggleView from "../../../../App/modules/customHooks/useToggleView";
import { InfoS } from "../../../../App/sharedWithServer/SectionsMeta/Info";
import { FeNameInfo } from "../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import MaterialStringEditor from "../../MaterialStringEditor";
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
