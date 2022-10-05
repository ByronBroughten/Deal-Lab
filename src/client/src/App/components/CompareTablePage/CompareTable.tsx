import {
  useTableActor,
  UseTableActorProps,
} from "../../modules/sectionActorHooks/useTableActor";
import { CompareTableHeaderRow } from "./CompareTable/CompareTableHeaderRow";
import { CompareTableTitleRow } from "./CompareTable/CompareTableTitleRow";
import { IndexRow } from "./CompareTable/IndexRow";
import { ProxyIndexRow } from "./CompareTable/ProxyIndexRow";

interface Props extends UseTableActorProps {}
export function CompareTable(props: Props) {
  const table = useTableActor(props);
  const { filteredRows, compareRowProxies } = table;
  return (
    <div className="CompareTable-root">
      <CompareTableTitleRow {...props} />
      <table className="CompareTable-table">
        <thead>
          {compareRowProxies.map(({ feId }) => (
            <ProxyIndexRow feId={feId} key={feId} />
          ))}
          <CompareTableHeaderRow {...props} />
        </thead>
        <tbody>
          {filteredRows.map(({ feId }) => (
            <IndexRow feId={feId} key={feId} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
