import React from "react";
import { useGetterVarbNext } from "../../../../../sharedWithServer/stateClassHooks/useGetterVarb";
import { LabeledEquation } from "../../ListGroupShared/ListItemValue/LabeledEquation";
import { LoadedVarbEditor } from "../../ListGroupShared/ListItemValue/LoadedVarbEditor";
import { useOption } from "../../ListGroupShared/useOption";
import { VarbListItemStyled } from "../../ListGroupShared/VarbListItemStyled";

type MemoProps = { feId: string; valueSourceSwitch: string };
const ListItemSingleTimeMemo = React.memo(function ListItemSingleTimeMemo({
  feId,
  valueSourceSwitch,
}: MemoProps) {
  const feInfo = { sectionName: "singleTimeItem", feId } as const;
  const { option, nextValueSwitch } = useOption(
    {
      labeledEquation: () => <LabeledEquation {...feInfo} key={feId} />,
      loadedVarb: () => (
        <LoadedVarbEditor
          {...{
            feInfo,
            valueVarbName: "value",
            key: feId,
          }}
        />
      ),
    },
    valueSourceSwitch
  );
  return (
    <VarbListItemStyled
      {...{
        ...feInfo,
        firstCells: option(),
        useXBtn: true,
      }}
    />
  );
});

export function ListItemSingleTime({ feId }: { feId: string }) {
  const varb = useGetterVarbNext({
    feId,
    sectionName: "singleTimeItem",
    varbName: "valueSourceSwitch",
  });
  return (
    <ListItemSingleTimeMemo
      {...{ feId, valueSourceSwitch: varb.value("string") }}
    />
  );
}
