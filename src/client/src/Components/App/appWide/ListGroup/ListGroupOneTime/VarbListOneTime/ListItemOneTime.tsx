import React from "react";
import { useGetterSection } from "../../../../../../stateHooks/useGetterSection";
import { VarbListItemSimple } from "../../ListGroupShared/VarbListItemSimple";

type MemoProps = { feId: string; valueSourceName: string };
const ListItemOneTimeMemo = React.memo(function ListItemOneTimeMemo({
  feId,
}: MemoProps) {
  const feInfo = { sectionName: "onetimeItem", feId } as const;
  return (
    <VarbListItemSimple
      {...{
        ...feInfo,
        varbName: "valueDollarsEditor",
        sx: {
          "& .VarbListItemSimple-editorCell": {
            ".DraftEditor-root": {
              minWidth: 60,
            },
          },
        },
      }}
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
      {...{
        feId,
        valueSourceName: item.valueNext("valueSourceName"),
      }}
    />
  );
}
