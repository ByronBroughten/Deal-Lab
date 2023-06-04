import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import {
  VarbListGeneric,
  VarbListGenericMenuType,
} from "../ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListStandardHeaders } from "../ListGroup/ListGroupShared/VarbListGeneric/VarbListStandardHeaders";
import { ListItemOngoing } from "./VarbListOngoing/ListItemOngoing";

type Props = {
  feId: string;
  className?: string;
  menuType?: VarbListGenericMenuType;
};
export function VarbListOngoing({ feId, ...rest }: Props) {
  const list = useSetterSection({ sectionName: "ongoingList", feId });
  const totalVarbName = list.get.activeSwitchTargetName("total", "periodic");
  const itemPeriodicSwitch = list
    .varb("itemPeriodicSwitch")
    .value("ongoingSwitch");

  const itemName = list.meta.varbListItem;
  const addItem = () => {
    const itemValueSource = list.value("itemValueSource");
    list.addChild(itemName, {
      sectionValues: {
        valueSourceName: itemValueSource,
        valuePeriodicSwitch: itemPeriodicSwitch,
      },
    });
  };

  return (
    <VarbListGeneric
      {...{
        ...rest,
        feInfo: list.feInfo,
        headers: <VarbListStandardHeaders contentTitle={"Cost"} />,
        itemName: "ongoingItem",
        totalVarbName,
        addItem,
        makeItemNode: ({ feId }) => (
          <ListItemOngoing {...{ feId, key: feId }} />
        ),
      }}
    />
  );
}
