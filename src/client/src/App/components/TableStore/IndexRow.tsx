import {
  useIndexTableRowActor,
  UseIndexTableRowActorProps,
} from "../../modules/sectionActorHooks/useIndexTableRowActor";
import TrashBtn from "../general/TrashBtn";

export default function IndexRow(props: UseIndexTableRowActorProps) {
  const indexRow = useIndexTableRowActor(props);
  const title = indexRow.get.value("displayName", "string");
  return (
    <tr className="TableStore-tableRow">
      <td className="TableStore-tableCell">{title}</td>
      {indexRow.cells.map((cell) => {
        const value = cell.value("displayVarb", "string");
        return <td className="TableStore-tableCell">{value}</td>;
      })}
      <td className="TableStore-tableCell">
        <TrashBtn
          className="TableStore-trashBtn"
          onClick={() => indexRow.deleteSelf()}
        />
      </td>
    </tr>
  );
}
