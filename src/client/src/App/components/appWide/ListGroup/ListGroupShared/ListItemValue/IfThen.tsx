import { useToggleView } from "../../../../../modules/customHooks/useToggleView";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { MuiRow } from "../../../../general/MuiRow";
import { MaterialStringEditor } from "../../../../inputs/MaterialStringEditor";
import { FirstContentCell } from "../VarbListGeneric/FirstContentCellAndHeader";
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
      <FirstContentCell>
        <MuiRow sx={{ alignItems: "flex-end", flexWrap: "nowrap" }}>
          <ConditionalRowList
            {...{
              feId: numVarbItem.onlyChild("conditionalRowList").feId,
              viewIsOpen,
              toggleView,
            }}
          />
        </MuiRow>
      </FirstContentCell>
    </>
  );
}
