import React from "react";
import { useGetterVarbNext } from "../../../../../sharedWithServer/stateClassHooks/useGetterVarb";
import { VarbListItemGeneric } from "../../ListGroupShared/VarbListItemGeneric";

type MemoProps = { feId: string; valueSourceName: string };
const ListItemSingleTimeMemo = React.memo(function ListItemSingleTimeMemo({
  feId,
  valueSourceName,
}: MemoProps) {
  const feInfo = { sectionName: "singleTimeItem", feId } as const;
  return <VarbListItemGeneric {...feInfo} />;
});

export function ListItemSingleTime({ feId }: { feId: string }) {
  const varb = useGetterVarbNext({
    feId,
    sectionName: "singleTimeItem",
    varbName: "valueSourceName",
  });
  return (
    <ListItemSingleTimeMemo
      {...{ feId, valueSourceName: varb.value("string") }}
    />
  );
}
