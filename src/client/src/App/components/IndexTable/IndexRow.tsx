import {
  useIndexTableRowActor,
  UseIndexTableRowActorProps,
} from "../../modules/sectionActorHooks/useIndexTableRowActor";
import TrashBtn from "../general/TrashBtn";

export default function IndexRow(props: UseIndexTableRowActorProps) {
  const indexRow = useIndexTableRowActor(props);
  const title = indexRow.get.value("title", "string");
  return (
    <tr className="IndexTable-tableRow">
      <td className="IndexTable-tableCell">{title}</td>
      {indexRow.cells.map((cell) => {
        const value = cell.varb("value").displayVarb();
        return <td className="IndexTable-tableCell">{value}</td>;
      })}
      <td className="IndexTable-tableCell">
        <TrashBtn
          className="IndexTable-trashBtn"
          onClick={() => indexRow.deleteSelf()}
        />
      </td>
    </tr>
  );
}
