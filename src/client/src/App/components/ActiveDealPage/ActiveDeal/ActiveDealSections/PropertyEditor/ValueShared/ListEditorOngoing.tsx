import { useSetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VarbListGenericMenuType } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListStandardHeaders } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric/VarbListStandardHeaders";
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

  const itemPeriodicSwitch = ongoingList.value("itemPeriodicSwitch");
  const totalVarb = ongoingList.get.activeSwitchTarget("total", "periodic");

  const onChange = (displayName?: string) =>
    ongoingList.addChild("ongoingItem", {
      sectionValues: {
        valuePeriodicSwitch: itemPeriodicSwitch,
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
              headers: <VarbListStandardHeaders contentTitle={"Cost"} />,
              varbListTotal: totalVarb.displayVarb(),
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
