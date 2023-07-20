import React from "react";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { VarbListItemSimple } from "../../ListGroup/ListGroupShared/VarbListItemSimple";

interface MemoProps {
  feId: string;
  displayValueVarb: string;
}
const ListItemOngoingMemo = React.memo(function ListItemOngoingMemo({
  feId,
}: MemoProps) {
  const feInfo = { sectionName: "periodicItem", feId } as const;
  return (
    <VarbListItemSimple
      {...{
        sx: {
          "& .VarbListItemSimple-editorCell": {
            ".DraftEditor-root": {
              minWidth: 25,
            },
          },
        },
        ...feInfo,
        valueEditorName: "valueDollarsPeriodicEditor",
      }}
    />
  );
});

type Props = { feId: string };
export function ListItemOngoing({ feId }: Props) {
  const section = useGetterSection({ sectionName: "periodicItem", feId });
  const valueVarbName = section.activeSwitchTargetName(
    "valueDollars",
    "periodic"
  );
  const valueVarb = section.varbNext(valueVarbName);
  return (
    <ListItemOngoingMemo
      {...{
        feId,
        displayValueVarb: valueVarb.displayVarb(),
      }}
    />
  );
}
