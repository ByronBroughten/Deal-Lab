import React from "react";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { VarbListItemGeneric } from "../../ListGroupShared/VarbListItemGeneric";

type MemoProps = { feId: string; valueSourceName: string };
const ListItemSingleTimeMemo = React.memo(function ListItemSingleTimeMemo({
  feId,
}: MemoProps) {
  const feInfo = { sectionName: "singleTimeItem", feId } as const;
  return (
    <VarbListItemGeneric {...{ ...feInfo, valueEditorName: "valueEditor" }} />
  );
});

export function ListItemSingleTime({ feId }: { feId: string }) {
  const item = useGetterSection({
    feId,
    sectionName: "singleTimeItem",
  });
  return (
    <ListItemSingleTimeMemo
      {...{ feId, valueSourceName: item.valueNext("valueSourceName") }}
    />
  );
}
