import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import {
  VarbListGeneric,
  VarbListGenericMenuType,
} from "../ListGroup/ListGroupShared/VarbListGeneric";
import { ListItemOngoing } from "./VarbListOngoing/ListItemOngoing";

type Props = {
  feId: string;
  className?: string;
  menuType?: VarbListGenericMenuType;
};
export function VarbListOngoing({ feId, ...rest }: Props) {
  const list = useSetterSection({ sectionName: "ongoingList", feId });
  const totalVarbName = list.get.activeSwitchTargetName("total", "ongoing");
  const itemOngoingSwitch = list.varb("itemOngoingSwitch").value("string");

  const itemName = list.meta.varbListItem;
  const addItem = () => {
    const itemValueSource = list.value("itemValueSource");
    list.addChild(itemName, {
      sectionValues: {
        valueSourceName: itemValueSource,
        valueOngoingSwitch: itemOngoingSwitch,
      },
    });
  };

  return (
    <VarbListGeneric
      {...{
        ...rest,
        feInfo: list.feInfo,
        itemName: "ongoingItem",
        totalVarbName,
        contentTitle: "Cost",
        addItem,
        makeItemNode: ({ feId }) => (
          <ListItemOngoing {...{ feId, key: feId }} />
        ),
      }}
    />
  );
}
// Should I make separate lists for utilities, closing costs, etc?
// No, just capEx I think.
