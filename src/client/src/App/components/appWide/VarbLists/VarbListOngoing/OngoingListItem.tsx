import { ongoingVarb } from "../../../../sharedWithServer/SectionsMeta/baseSectionsUtils/RelSwitchVarb";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import LabeledEquation from "../../ListGroup/ListGroupShared/ListItemValue/LabeledEquation";
import LabeledSpanOverCost from "../../ListGroup/ListGroupShared/ListItemValue/LabeledSpanOverCost";
import { LoadedVarbEditor } from "../../ListGroup/ListGroupShared/ListItemValue/LoadedVarbEditor";
import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

export function OngoingListItem({ feId }: { feId: string }) {
  const feInfo = { sectionName: "ongoingItem", feId } as const;
  const virtualVarb = useSetterSection(feInfo);
  const valueVarbName = virtualVarb.get.switchVarbName("value", "ongoing");

  const switchValue = virtualVarb.get.switchValue("value", "ongoing");
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
          loadedVarb: () => <LoadedVarbEditor {...{ valueVarbName, feInfo }} />,
        },
      }}
    />
  );
}
