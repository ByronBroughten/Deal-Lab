import React from "react";
import LabeledEquation from "../../ListGroupShared/ListItemValue/LabeledEquation";
import LoadedVarb from "../../ListGroupShared/ListItemValue/LoadedVarb";
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
            <LoadedVarb
              feVarbInfo={{ varbName: "value", ...feInfo }}
              key={feId}
            />
          ),
        },
      }}
    />
  );
}
