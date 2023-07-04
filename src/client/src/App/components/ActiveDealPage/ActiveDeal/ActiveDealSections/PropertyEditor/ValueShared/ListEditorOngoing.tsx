import { SectionValues } from "../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useAction } from "../../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
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
  const addChild = useAction("addChild");
  const feInfo = { sectionName: "periodicList", feId } as const;
  const periodicList = useGetterSection(feInfo);

  const ongoingItems = periodicList.children("periodicItem");
  const itemDisplayNames = ongoingItems.map(
    (item) => item.valueNext("displayName").mainText
  );

  const itemPeriodicSwitch = periodicList.valueNext("itemPeriodicSwitch");
  const totalVarb = periodicList.activeSwitchTarget("total", "periodic");

  const onChange = (displayName?: string) => {
    const sectionValues: Partial<SectionValues<"periodicItem">> = {
      valuePeriodicSwitch: itemPeriodicSwitch,
      ...(displayName && { displayNameEditor: displayName }),
    };
    addChild({
      feInfo,
      childName: "periodicItem",
      options: { sectionValues },
    });
  };

  return (
    <ValueListGeneral
      {...{
        ...periodicList.feInfo,
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
