import React from "react";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { LabeledEquation } from "../../ListGroup/ListGroupShared/ListItemValue/LabeledEquation";
import { LoadedVarbEditor } from "../../ListGroup/ListGroupShared/ListItemValue/LoadedVarbEditor";
import { VarbListItemStyled } from "../../ListGroup/ListGroupShared/VarbListItemStyled";
import { useOption } from "./../../ListGroup/ListGroupShared/useOption";

interface MemoProps {
  feId: string;
  valueSourceSwitch: string;
  endAdornment: string;
  valueVarbName: "valueMonthly";
  displayValueVarb: string;
}
const ListItemOngoingMemo = React.memo(function ListItemOngoingMemo({
  feId,
  valueSourceSwitch,
  valueVarbName,
  endAdornment,
  displayValueVarb,
}: MemoProps) {
  const feInfo = { sectionName: "ongoingItem", feId } as const;
  const { option, nextValueSwitch } = useOption(
    {
      labeledEquation: () => (
        <LabeledEquation {...{ ...feInfo, endAdornment }} />
      ),
      loadedVarb: () => <LoadedVarbEditor {...{ feInfo, valueVarbName }} />,
    },
    valueSourceSwitch
  );
  return (
    <VarbListItemStyled
      {...{
        ...feInfo,
        nextValueSwitch,
        firstCells: option(),
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
