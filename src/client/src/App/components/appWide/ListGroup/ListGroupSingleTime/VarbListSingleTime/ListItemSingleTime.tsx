import React from "react";
import LabeledEquation from "../../../AdditiveListNext/AdditiveItem/LabeledEquation";
import LoadedVarb from "../../../AdditiveListNext/AdditiveItem/LoadedVarb";
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
