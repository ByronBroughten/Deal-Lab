import {
  useIndexTableRowActor,
  UseIndexTableRowActorProps,
} from "../../modules/sectionActorHooks/useIndexTableRowActor";
import TrashBtn from "../general/TrashBtn";

export default function IndexRow(props: UseIndexTableRowActorProps) {
  const indexRow = useIndexTableRowActor(props);
  const title = indexRow.get.value("displayName", "string");
  return (
    <tr className="CompareTable-tableRow">
      <td className="CompareTable-tableCell">{title}</td>
      {indexRow.cells.map((cell) => {
        const value = cell.value("displayVarb", "string");
        return <td className="CompareTable-tableCell">{value}</td>;
      })}
      <td className="CompareTable-tableCell">
        <TrashBtn
          className="CompareTable-trashBtn"
          onClick={() => indexRow.deleteSelf()}
        />
      </td>
    </tr>
  );
}
