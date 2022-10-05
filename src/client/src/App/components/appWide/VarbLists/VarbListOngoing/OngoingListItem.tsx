import { ongoingVarb } from "../../../../sharedWithServer/SectionsMeta/baseSectionsVarbs/RelSwitchVarb";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import LabeledEquation from "../../ListGroup/ListGroupShared/ListItemValue/LabeledEquation";
import LabeledSpanOverCost from "../../ListGroup/ListGroupShared/ListItemValue/LabeledSpanOverCost";
import { LoadedVarbEditor } from "../../ListGroup/ListGroupShared/ListItemValue/LoadedVarbEditor";
import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";
import { FeInfoByType } from "./../../../../sharedWithServer/SectionsMeta/Info";

type GetDoEqualsProps = {
  feInfo: FeInfoByType<"varbListItem">;
  showEqualsOnlyForPureVarb?: boolean;
};
function getDoEquals({ feInfo, showEqualsOnlyForPureVarb }: GetDoEqualsProps) {
  if (showEqualsOnlyForPureVarb) {
  } else {
    return true;
  }
}

type Props = { feId: string; showEqualsOnlyForPureVarb?: boolean };
export function OngoingListItem({
  feId,
  showEqualsOnlyForPureVarb = false,
}: Props) {
  const feInfo = { sectionName: "ongoingItem", feId } as const;
  const virtualVarb = useSetterSection(feInfo);
  const valueVarbName = virtualVarb.get.switchVarbName(
    "value",
    "ongoing"
  ) as "valueMonthly";

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
          loadedVarb: () => <LoadedVarbEditor {...{ feInfo, valueVarbName }} />,
        },
      }}
    />
  );
}
