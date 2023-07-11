import React from "react";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { VarbListItemGeneric } from "../../ListGroupShared/VarbListItemGeneric";

type MemoProps = { feId: string; valueSourceName: string };
const ListItemOneTimeMemo = React.memo(function ListItemOneTimeMemo({
  feId,
}: MemoProps) {
  const feInfo = { sectionName: "onetimeItem", feId } as const;
  return (
    <VarbListItemGeneric
      {...{ ...feInfo, valueEditorName: "valueDollarsEditor" }}
    />
  );
});

export function ListItemOneTime({ feId }: { feId: string }) {
  const item = useGetterSection({
    feId,
    sectionName: "onetimeItem",
  });
  return (
    <ListItemOneTimeMemo
      {...{ feId, valueSourceName: item.valueNext("valueSourceName") }}
    />
  );
}
