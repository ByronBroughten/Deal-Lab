import React from "react";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

interface MemoProps {
  feId: string;
  displayValueVarb: string;
}
const ListItemOngoingMemo = React.memo(function ListItemOngoingMemo({
  feId,
}: MemoProps) {
  const feInfo = { sectionName: "ongoingItem", feId } as const;
  return (
    <VarbListItemGeneric
      {...{
        ...feInfo,
        valueEditorName: "valueOngoingEditor",
      }}
    />
  );
});

type Props = { feId: string };
export function ListItemOngoing({ feId }: Props) {
  const section = useSetterSection({ sectionName: "ongoingItem", feId });
  const valueVarbName = section.get.activeSwitchTargetName("value", "ongoing");
  const valueVarb = section.varb(valueVarbName);
  return (
    <ListItemOngoingMemo
      {...{
        feId,
        displayValueVarb: valueVarb.get.displayVarb(),
      }}
    />
  );
}
