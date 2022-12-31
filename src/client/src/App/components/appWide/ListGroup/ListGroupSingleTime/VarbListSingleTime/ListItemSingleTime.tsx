import React from "react";
import { useGetterVarbNext } from "../../../../../sharedWithServer/stateClassHooks/useGetterVarb";
import { LabeledEquation } from "../../ListGroupShared/ListItemValue/LabeledEquation";
import { LoadedVarbEditor } from "../../ListGroupShared/ListItemValue/LoadedVarbEditor";
import { useOption } from "../../ListGroupShared/useOption";
import { VarbListItemGenericNext } from "../../ListGroupShared/VarbListItemGenericNext";

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
    <VarbListItemGenericNext
      {...{
        ...feInfo,
        nextValueSwitch,
        firstCells: option(),
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
