import React from "react";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

interface MemoProps {
  feId: string;
  valueSourceName: string;
  endAdornment: string;
  valueVarbName: "valueMonthly";
  displayValueVarb: string;
}
const ListItemOngoingMemo = React.memo(function ListItemOngoingMemo({
  feId,
  endAdornment,
}: MemoProps) {
  const feInfo = { sectionName: "ongoingItem", feId } as const;
  return (
    <VarbListItemGeneric
      {...{ valueEditorProps: { endAdornment }, ...feInfo }}
    />
  );
});

type Props = { feId: string };
export function ListItemOngoing({ feId }: Props) {
  const section = useSetterSection({ sectionName: "ongoingItem", feId });
  const valueVarbName = section.get.activeSwitchTargetName(
    "value",
    "ongoing"
  ) as "valueMonthly";

  const valueVarb = section.varb(valueVarbName);
  const { endAdornment } = section.get.switchVarb("value", "ongoing");
  return (
    <ListItemOngoingMemo
      {...{
        feId,
        displayValueVarb: valueVarb.get.displayVarb(),
        valueVarbName,
        valueSourceName: section.get.valueNext("valueSourceName"),
        endAdornment,
      }}
    />
  );
}
