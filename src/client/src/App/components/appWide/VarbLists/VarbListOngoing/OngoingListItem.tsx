import { ongoingVarb } from "../../../../sharedWithServer/SectionsMeta/baseSectionsUtils/RelSwitchVarb";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import LabeledEquation from "../../ListGroup/ListGroupShared/ListItemValue/LabeledEquation";
import LabeledSpanOverCost from "../../ListGroup/ListGroupShared/ListItemValue/LabeledSpanOverCost";
import { LoadedVarbEditor } from "../../ListGroup/ListGroupShared/ListItemValue/LoadedVarbEditor";
import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

export function OngoingListItem({ feId }: { feId: string }) {
  const feInfo = { sectionName: "ongoingItem", feId } as const;
  const listItem = useSetterSection(feInfo);
  const valueVarbName = listItem.get.switchVarbName("value", "ongoing");

  const switchValue = listItem.get.switchValue("value", "ongoing");
  const { endAdornment } = ongoingVarb.target(switchValue);

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
            <LoadedVarbEditor
              feVarbInfo={{ varbName: valueVarbName, ...feInfo }}
            />
          ),
        },
      }}
    />
  );
}
