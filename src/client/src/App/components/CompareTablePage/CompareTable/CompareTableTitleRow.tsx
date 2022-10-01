import {
  useTableActor,
  UseTableActorProps,
} from "../../../modules/sectionActorHooks/useTableActor";
import { VariableOption } from "../../../sharedWithServer/StateEntityGetters/VariableGetterSections";
import { MaterialStringEditor } from "../../inputs/MaterialStringEditor";
import VarbAutoComplete from "../../inputs/VarbAutoComplete";

interface Props extends UseTableActorProps {
  title: string;
}
export function CompareTableTitleRow({ title, ...rest }: Props) {
  const table = useTableActor(rest);
  return (
    <div className="CompareTable-titleRow">
      <h5 className="CompareTable-title CompareTable-controlRowItem">
        {title}
      </h5>
      <div className="CompareTable-controlRow">
        <MaterialStringEditor
          label="Filter by title"
          className="CompareTable-filterEditor CompareTable-controlRowItem"
          feVarbInfo={table.get.varbInfo("titleFilter")}
        />
        <VarbAutoComplete
          onSelect={(o: VariableOption) => table.addColumn(o.varbInfo)}
          placeholder="Add column"
          className="CompareTable-addColumnSelector CompareTable-controlRowItem"
        />
      </div>
    </div>
  );
}
