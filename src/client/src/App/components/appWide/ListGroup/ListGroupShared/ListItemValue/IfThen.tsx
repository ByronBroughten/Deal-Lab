import useToggleView from "../../../../../modules/customHooks/useToggleView";
import { MaterialStringEditor } from "../../../../inputs/MaterialStringEditor";
import IfThenContent from "./IfThen/IfThenContent";

type Props = { feId: string };
export default function IfThen({ feId }: Props) {
  const { viewIsOpen, toggleView } = useToggleView();
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditor
          feVarbInfo={{
            sectionName: "userVarbItem",
            varbName: "displayName",
            feId,
          }}
          valueType="stringObj"
        />
      </td>
      <td className="AdditiveItem-contentCell">
        <div className="AdditiveItem-contentCellDiv">
          <IfThenContent {...{ feId, viewIsOpen, toggleView }} />
        </div>
      </td>
    </>
  );
}
