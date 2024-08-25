import { SectionValues } from "../../../../../../../sharedWithServer/stateSchemas/StateValue";
import { useAction } from "../../../../../../stateClassHooks/useAction";
import { useGetterSection } from "../../../../../../stateClassHooks/useGetterSection";
import { VarbListGenericMenuType } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListStandardHeaders } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric/VarbListStandardHeaders";
import { VarbListTableSectionGeneric } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric/VarbListTableSectionGeneric";
import { PeriodicItem } from "../../../../../appWide/VarbLists/ListGroupPeriodicList/PeriodicItem";
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
export function PeriodicList({
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

  const totalVarb = periodicList.varbNext("totalMonthly");
  const onChange = (displayName?: string) => {
    const sectionValues: Partial<SectionValues<"periodicItem">> = {
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
              <PeriodicItem {...{ feId: item.feId, key: item.feId }} />
            ))}
          </VarbListTableSectionGeneric>
        ),
      }}
    />
  );
}
