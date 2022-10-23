import React from "react";
import { useGetterVarb } from "../../../../../sharedWithServer/stateClassHooks/useGetterVarb";
import { LabeledEquation } from "../../ListGroupShared/ListItemValue/LabeledEquation";
import { LoadedVarbEditor } from "../../ListGroupShared/ListItemValue/LoadedVarbEditor";
import { useOption } from "../../ListGroupShared/useOption";
import { VarbListItemGenericNext } from "../../ListGroupShared/VarbListItemGenericNext";

type MemoProps = { feId: string; valueSwitch: string };
const ListItemSingleTimeMemo = React.memo(function ListItemSingleTimeMemo({
  feId,
  valueSwitch,
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
    valueSwitch
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
  const varb = useGetterVarb({
    feId,
    sectionName: "singleTimeItem",
    varbName: "valueSwitch",
  });
  return (
    <ListItemSingleTimeMemo {...{ feId, valueSwitch: varb.value("string") }} />
  );
}
