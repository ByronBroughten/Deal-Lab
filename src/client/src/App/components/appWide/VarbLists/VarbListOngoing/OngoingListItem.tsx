import { ongoingStuff } from "../../../../sharedWithServer/SectionsMeta/baseSections/switchNames";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import LabeledEquation from "../../ListGroup/ListGroupShared/ListItemValue/LabeledEquation";
import LabeledSpanOverCost from "../../ListGroup/ListGroupShared/ListItemValue/LabeledSpanOverCost";
import LoadedVarb from "../../ListGroup/ListGroupShared/ListItemValue/LoadedVarb";
import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

export function OngoingListItem({ feId }: { feId: string }) {
  const feInfo = { sectionName: "ongoingItem", feId } as const;
  const listItem = useSetterSection(feInfo);
  const valueVarbName = listItem.get.switchVarbName("value", "ongoing");

  const switchValue = listItem.get.switchValue("value", "ongoing");
  const { endAdornment } = ongoingStuff[switchValue];

  return (
    <VarbListItemGeneric
      {...{
        feInfo,
        switchOptions: {
          labeledEquation: () => (
            <LabeledEquation {...{ feInfo, endAdornment }} />
          ),
          labeledSpanOverCost: () => (
            <LabeledSpanOverCost {...{ valueVarbName, feInfo }} />
          ),
          loadedVarb: () => (
            <LoadedVarb feVarbInfo={{ varbName: valueVarbName, ...feInfo }} />
          ),
        },
      }}
    />
  );
}
