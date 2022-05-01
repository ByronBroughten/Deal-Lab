import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import {
  useRowIndexActions,
  UseRowIndexActionsProps,
} from "../../modules/useRowIndexActions";
import { InfoS } from "../../sharedWithServer/SectionMetas/Info";
import TrashBtn from "../general/TrashBtn";

export default function IndexRow(props: UseRowIndexActionsProps) {
  const { analyzer } = useAnalyzerContext();
  const { deleteRowAndSource } = useRowIndexActions(props);

  const rowDbInfo = InfoS.db("tableRow", props.rowDbId);
  const row = analyzer.section(rowDbInfo);
  const cells = analyzer.childSections(rowDbInfo, "cell");

  return (
    <tr className="IndexTable-tableRow">
      <td className="IndexTable-tableCell">{row.value("title", "string")}</td>
      {cells.map((cell) => {
        const value = analyzer.displayVarb("value", cell.feInfo);
        return <td className="IndexTable-tableCell">{value}</td>;
      })}
      <td className="IndexTable-tableCell">
        <TrashBtn
          className="IndexTable-trashBtn"
          onClick={deleteRowAndSource}
        />
      </td>
    </tr>
  );
}
