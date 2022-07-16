import React from "react";
import LoadIndexSectionBtn from "./IndexSectionList/LoadIndexSectionBtn";

type Props = {
  displayName: string;
  onClick: () => void;
};
export default function RowIndexListRow({ displayName, onClick }: Props) {
  return (
    <div className="RowIndexRows-entry">
      <LoadIndexSectionBtn {...{ text: displayName, onClick }} />
    </div>
  );
}
