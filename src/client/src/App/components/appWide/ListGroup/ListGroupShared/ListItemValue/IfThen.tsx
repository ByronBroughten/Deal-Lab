import useToggleView from "../../../../../modules/customHooks/useToggleView";
import { MaterialStringEditorNext } from "../../../../inputs/MaterialStringEditorNext";
import IfThenContent from "./IfThen/IfThenContent";

type Props = { feId: string };
export default function IfThen({ feId }: Props) {
  const { viewIsOpen, toggleView } = useToggleView();
  return (
    <>
      <td className="AdditiveItem-nameCell">
        <MaterialStringEditorNext
          feVarbInfo={{
            sectionName: "userVarbItem",
            varbName: "displayName",
            feId,
          }}
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
