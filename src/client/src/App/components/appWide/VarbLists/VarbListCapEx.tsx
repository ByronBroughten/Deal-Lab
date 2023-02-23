import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import {
  VarbListGeneric,
  VarbListGenericMenuType,
} from "../ListGroup/ListGroupShared/VarbListGeneric";
import { ListItemCapEx } from "./VarbListOngoing/ListItemCapEx";

type Props = {
  feId: string;
  className?: string;
  menuType?: VarbListGenericMenuType;
};
export function VarbListCapEx({ feId, ...rest }: Props) {
  const list = useSetterSection({ sectionName: "capExList", feId });
  const totalVarbName = list.get.activeSwitchTargetName("total", "ongoing");
  const itemOngoingSwitch = list.varb("itemOngoingSwitch").value("string");
  const itemName = list.meta.varbListItem;
  const addItem = () => {
    list.addChild(itemName, {
      dbVarbs: { valueOngoingSwitch: itemOngoingSwitch },
    });
  };
  return (
    <VarbListGeneric
      {...{
        ...rest,
        feInfo: list.feInfo,
        itemName: "capExItem",
        totalVarbName,
        contentTitle: "Cost",
        addItem,
        makeItemNode: ({ feId }) => <ListItemCapEx {...{ feId, key: feId }} />,
      }}
    />
  );
}
// Should I make separate lists for utilities, closing costs, etc?
// No, just capEx I think.
