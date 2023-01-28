import useToggleView from "../../../../../modules/customHooks/useToggleView";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { MaterialStringEditor } from "../../../../inputs/MaterialStringEditor";
import { ConditionalRowList } from "./IfThen/ConditionalRowList";

type Props = { feId: string };
export default function IfThen({ feId }: Props) {
  const sectionName = "userVarbItem";
  const { viewIsOpen, toggleView } = useToggleView();
  const userVarbItem = useGetterSection({
    sectionName,
    feId,
  });

  return (
    <>
      <td className="VarbListTable-nameCell">
        <MaterialStringEditor {...userVarbItem.varbInfo("displayNameEditor")} />
      </td>
      <td className="VarbListTable-firstContentCell">
        <div className="AdditiveItem-contentCellDiv">
          <ConditionalRowList
            {...{
              feId: userVarbItem.onlyChild("conditionalRowList").feId,
              viewIsOpen,
              toggleView,
            }}
          />
        </div>
      </td>
    </>
  );
}
