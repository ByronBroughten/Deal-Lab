import { useToggleView } from "../../../../../modules/customHooks/useToggleView";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { MaterialStringEditor } from "../../../../inputs/MaterialStringEditor";
import { ConditionalRowList } from "./IfThen/ConditionalRowList";

type Props = { feId: string };
export default function IfThen({ feId }: Props) {
  const sectionName = "numVarbItem";
  const { viewIsOpen, toggleView } = useToggleView();
  const numVarbItem = useGetterSection({
    sectionName,
    feId,
  });

  return (
    <>
      <td className="VarbListTable-nameCell">
        <MaterialStringEditor {...numVarbItem.varbInfo("displayNameEditor")} />
      </td>
      <td className="VarbListTable-firstContentCell">
        <div className="VarbListItem-contentCellDiv">
          <ConditionalRowList
            {...{
              feId: numVarbItem.onlyChild("conditionalRowList").feId,
              viewIsOpen,
              toggleView,
            }}
          />
        </div>
      </td>
    </>
  );
}
