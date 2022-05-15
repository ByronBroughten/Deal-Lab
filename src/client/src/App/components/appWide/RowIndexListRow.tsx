import React from "react";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import {
  useRowIndexActions,
  UseRowIndexActionsProps,
} from "../../modules/useRowIndexActions";
import { InfoS } from "../../sharedWithServer/SectionsMeta/Info";
import TrashBtn from "../general/TrashBtn";
import LoadIndexSectionBtn from "./IndexSectionList/LoadIndexSectionBtn";

export default function RowIndexListRow(props: UseRowIndexActionsProps) {
  const { rowDbId } = props;
  const { analyzer } = useAnalyzerContext();

  const row = analyzer.section(InfoS.db("tableRow", rowDbId));
  const title = row.value("title", "string");

  const { load, deleteRowAndSource } = useRowIndexActions(props);

  return (
    <div key={rowDbId} className="RowIndexRows-entry">
      <LoadIndexSectionBtn {...{ text: title, onClick: load }} />
      <TrashBtn
        className="RowIndexRows-trashBtn"
        onClick={deleteRowAndSource}
      />
    </div>
  );
}
