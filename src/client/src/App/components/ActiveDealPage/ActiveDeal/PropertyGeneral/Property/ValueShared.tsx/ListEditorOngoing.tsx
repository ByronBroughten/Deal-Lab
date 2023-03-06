import { useSetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VarbListGenericMenuType } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListTableSectionGeneric } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric/VarbListTableSectionGeneric";
import { ListItemOngoing } from "../../../../../appWide/VarbLists/VarbListOngoing/ListItemOngoing";
import { ListRouteName } from "../../../../../UserListEditorPage/UserComponentClosed";
import { ValueListGeneral } from "./ValueListGeneral";

type Props = {
  feId: string;
  menuType: VarbListGenericMenuType;
  menuDisplayNames?: readonly string[];
  routeBtnProps?: {
    title: string;
    routeName: ListRouteName;
  };
};
export function ListEditorOngoing({
  feId,
  menuType,
  menuDisplayNames,
  ...rest
}: Props) {
  const ongoingList = useSetterSection({
    sectionName: "ongoingList",
    feId,
  });

  const ongoingItems = ongoingList.get.children("ongoingItem");
  const itemDisplayNames = ongoingItems.map(
    (item) => item.valueNext("displayName").mainText
  );

  const itemOngoingSwitch = ongoingList.value("itemOngoingSwitch");
  const totalVarb = ongoingList.get.activeSwitchTarget("total", "ongoing");

  const onChange = (displayName?: string) =>
    ongoingList.addChild("ongoingItem", {
      sectionValues: {
        valueOngoingSwitch: itemOngoingSwitch,
        ...(displayName && { displayNameEditor: displayName }),
      },
    });

  return (
    <ValueListGeneral
      {...{
        ...ongoingList.feInfo,
        ...rest,
        menuType,
        menuDisplayNames,
        itemDisplayNames,
        onChange,
        table: (
          <VarbListTableSectionGeneric
            {...{
              varbListTotal: totalVarb.displayVarb(),
              contentTitle: "Cost",
              addItem: () => onChange(),
            }}
          >
            {ongoingItems.map((item) => (
              <ListItemOngoing {...{ feId: item.feId, key: item.feId }} />
            ))}
          </VarbListTableSectionGeneric>
        ),
      }}
    />
  );
}
