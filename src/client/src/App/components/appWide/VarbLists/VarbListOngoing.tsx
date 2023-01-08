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
  return (
    <VarbListGeneric
      {...{
        ...rest,
        feInfo: list.feInfo,
        itemName: "ongoingItem",
        totalVarbName,
        contentTitle: "Cost",
        childDbVarbs: {
          valueOngoingSwitch: itemOngoingSwitch,
        },
        makeItemNode: ({ feId }) => (
          <ListItemOngoing {...{ feId, key: feId }} />
        ),
      }}
    />
  );
}
