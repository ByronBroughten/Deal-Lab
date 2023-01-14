import React from "react";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { LabeledEquation } from "../../ListGroup/ListGroupShared/ListItemValue/LabeledEquation";
import { LabeledSpanOverCost } from "../../ListGroup/ListGroupShared/ListItemValue/LabeledSpanOverCost";
import { LoadedVarbEditor } from "../../ListGroup/ListGroupShared/ListItemValue/LoadedVarbEditor";
import { VarbListItemGenericNext } from "../../ListGroup/ListGroupShared/VarbListItemGenericNext";
import { useOption } from "./../../ListGroup/ListGroupShared/useOption";

interface MemoProps {
  feId: string;
  valueSourceSwitch: string;
  endAdornment: string;
  valueVarbName: "valueMonthly";
  displayValueVarb: string;
  lifespanVarbName: string;
}
const ListItemOngoingMemo = React.memo(function ListItemOngoingMemo({
  feId,
  valueSourceSwitch,
  valueVarbName,
  endAdornment,
  displayValueVarb,
  lifespanVarbName,
}: MemoProps) {
  const feInfo = { sectionName: "ongoingItem", feId } as const;
  const { option, nextValueSwitch } = useOption(
    {
      labeledEquation: () => (
        <LabeledEquation {...{ ...feInfo, endAdornment }} />
      ),
      labeledSpanOverCost: () => (
        <LabeledSpanOverCost
          {...{ valueVarbName, ...feInfo, displayValueVarb, lifespanVarbName }}
        />
      ),
      loadedVarb: () => <LoadedVarbEditor {...{ feInfo, valueVarbName }} />,
    },
    valueSourceSwitch
  );
  return (
    <VarbListItemGenericNext
      {...{
        ...feInfo,
        nextValueSwitch,
        firstCells: option(),
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

  const lifespanVarbName = section.switchVarb("lifespan", "monthsYears")
    .varbName as "lifespanMonths" | "lifespanYears";
  const { endAdornment } = section.get.switchVarb("value", "ongoing");
  return (
    <ListItemOngoingMemo
      {...{
        feId,
        lifespanVarbName,
        displayValueVarb: valueVarb.get.displayVarb(),
        valueVarbName,
        valueSourceSwitch: section.get.valueNext("valueSourceSwitch"),
        endAdornment,
      }}
    />
  );
}
