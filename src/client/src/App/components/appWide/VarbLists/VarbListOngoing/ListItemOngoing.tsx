import React from "react";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { LabeledValueEditor } from "../../ListGroup/ListGroupShared/ListItemValue/LabeledValueEditor";
import { VarbListItemStyled } from "../../ListGroup/ListGroupShared/VarbListItemStyled";

interface MemoProps {
  feId: string;
  valueSourceSwitch: string;
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
    <VarbListItemStyled
      {...{
        ...feInfo,
        firstCells: <LabeledValueEditor {...{ ...feInfo, endAdornment }} />,
        useXBtn: true,
      }}
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
        valueSourceSwitch: section.get.valueNext("valueSourceSwitch"),
        endAdornment,
      }}
    />
  );
}
