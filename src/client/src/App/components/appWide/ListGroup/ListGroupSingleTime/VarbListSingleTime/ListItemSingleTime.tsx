import React from "react";
import { useGetterVarbNext } from "../../../../../sharedWithServer/stateClassHooks/useGetterVarb";
import { VarbListItemGeneric } from "../../ListGroupShared/VarbListItemGeneric";

type MemoProps = { feId: string; valueSourceSwitch: string };
const ListItemSingleTimeMemo = React.memo(function ListItemSingleTimeMemo({
  feId,
  valueSourceSwitch,
}: MemoProps) {
  const feInfo = { sectionName: "singleTimeItem", feId } as const;
  return <VarbListItemGeneric {...feInfo} />;
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
