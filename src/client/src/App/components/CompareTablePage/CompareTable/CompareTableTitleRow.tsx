import {
  useTableActor,
  UseTableActorProps,
} from "../../../modules/sectionActorHooks/useTableActor";
import { MaterialStringEditor } from "../../inputs/MaterialStringEditor";

interface Props extends UseTableActorProps {}
export function CompareTableTitleRow(props: Props) {
  const table = useTableActor(props);
  return (
    <div className="CompareTable-titleRow">
      <div className="CompareTable-controlRow">
        <MaterialStringEditor
          label="Filter by title"
          className="CompareTable-filterEditor CompareTable-controlRowItem"
          feVarbInfo={table.get.varbInfo("titleFilter")}
        />
        {/* <VarbAutoComplete
          onSelect={(o: VariableOption) => table.addColumn(o.varbInfo)}
          placeholder="Add column"
          className="CompareTable-addColumnSelector CompareTable-controlRowItem"
        /> */}
      </div>
    </div>
  );
}
