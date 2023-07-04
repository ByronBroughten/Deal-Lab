import React from "react";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

interface MemoProps {
  feId: string;
  displayValueVarb: string;
}
const ListItemOngoingMemo = React.memo(function ListItemOngoingMemo({
  feId,
}: MemoProps) {
  const feInfo = { sectionName: "periodicItem", feId } as const;
  return (
    <VarbListItemGeneric
      {...{
        ...feInfo,
        valueEditorName: "valuePeriodicEditor",
      }}
    />
  );
});

type Props = { feId: string };
export function ListItemOngoing({ feId }: Props) {
  const section = useGetterSection({ sectionName: "periodicItem", feId });
  const valueVarbName = section.activeSwitchTargetName("value", "periodic");
  const valueVarb = section.varb(valueVarbName);
  return (
    <ListItemOngoingMemo
      {...{
        feId,
        displayValueVarb: valueVarb.displayVarb(),
      }}
    />
  );
}
