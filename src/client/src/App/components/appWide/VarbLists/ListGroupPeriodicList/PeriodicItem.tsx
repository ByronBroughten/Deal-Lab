import React from "react";
import { groupAdornment } from "../../../../../varbLabels/varbLabelUtils";
import { useGetterSection } from "../../../../stateClassHooks/useGetterSection";
import { VarbListItemSimple } from "../../ListGroup/ListGroupShared/VarbListItemSimple";

interface MemoProps {
  feId: string;
  displayValueVarb: string;
}
const PeriodicItemMemo = React.memo(function PeriodicItemMemo({
  feId,
}: MemoProps) {
  const feInfo = { sectionName: "periodicItem", feId } as const;
  const periodicItem = useGetterSection(feInfo);
  const periodicEditor = periodicItem.onlyChild("valueDollarsEditor");
  const frequency = periodicEditor.valueNext("valueEditorFrequency");
  return (
    <VarbListItemSimple
      {...{
        nameEditorProps: periodicItem.feInfo,
        ...periodicEditor.varbInfo2("valueEditor"),
        valueEditorProps: {
          startAdornment: "$",
          endAdornment: groupAdornment("periodic", frequency),
        },
        sx: {
          "& .VarbListItemSimple-editorCell": {
            ".DraftEditor-root": {
              minWidth: 25,
            },
          },
        },
      }}
    />
  );
});

type Props = { feId: string };
export function PeriodicItem({ feId }: Props) {
  const section = useGetterSection({ sectionName: "periodicItem", feId });
  const valueVarbName = "valueDollarsMonthly";
  const valueVarb = section.varbNext(valueVarbName);
  return (
    <PeriodicItemMemo
      {...{
        feId,
        displayValueVarb: valueVarb.displayVarb(),
      }}
    />
  );
}
