import React from "react";
import LoadIndexSectionBtn from "./IndexSectionList/LoadIndexSectionBtn";

type Props = {
  title: string;
  onClick: () => void;
};
export default function RowIndexListRow({ title, onClick }: Props) {
  return (
    <div className="RowIndexRows-entry">
      <LoadIndexSectionBtn {...{ text: title, onClick }} />
    </div>
  );
}
