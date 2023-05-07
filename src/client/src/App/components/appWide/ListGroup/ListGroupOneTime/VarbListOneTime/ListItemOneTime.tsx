import React from "react";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { VarbListItemGeneric } from "../../ListGroupShared/VarbListItemGeneric";

type MemoProps = { feId: string; valueSourceName: string };
const ListItemOneTimeMemo = React.memo(function ListItemOneTimeMemo({
  feId,
}: MemoProps) {
  const feInfo = { sectionName: "singleTimeItem", feId } as const;
  return (
    <VarbListItemGeneric {...{ ...feInfo, valueEditorName: "valueEditor" }} />
  );
});

export function ListItemOneTime({ feId }: { feId: string }) {
  const item = useGetterSection({
    feId,
    sectionName: "singleTimeItem",
  });
  return (
    <ListItemOneTimeMemo
      {...{ feId, valueSourceName: item.valueNext("valueSourceName") }}
    />
  );
}
