import React from "react";
import LabeledEquation from "../../ListGroupShared/ListItemValue/LabeledEquation";
import { LoadedVarbEditor } from "../../ListGroupShared/ListItemValue/LoadedVarbEditor";
import { VarbListItemGeneric } from "../../ListGroupShared/VarbListItemGeneric";

export function ListItemSingleTime({ feId }: { feId: string }) {
  const feInfo = { sectionName: "singleTimeItem", feId } as const;
  return (
    <VarbListItemGeneric
      {...{
        feInfo,
        switchOptions: {
          labeledEquation: () => <LabeledEquation {...{ feInfo, key: feId }} />,
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
      }}
    />
  );
}
