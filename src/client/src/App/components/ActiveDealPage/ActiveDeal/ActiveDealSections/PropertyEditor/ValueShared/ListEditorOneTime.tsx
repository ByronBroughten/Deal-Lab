import { useSetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { ListItemOneTime } from "../../../../../appWide/ListGroup/ListGroupOneTime/VarbListOneTime/ListItemOneTime";
import { VarbListGenericMenuType } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListTableSectionGeneric } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric/VarbListTableSectionGeneric";
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
export function ListEditorOneTime({
  feId,
  menuType,
  menuDisplayNames,
  ...rest
}: Props) {
  const onetimeList = useSetterSection({
    sectionName: "onetimeList",
    feId,
  });

  const onetimeItems = onetimeList.get.children("singleTimeItem");

  const itemDisplayNames = onetimeItems.map(
    (item) => item.valueNext("displayName").mainText
  );

  const totalVarb = onetimeList.get.varbNext("total");

  const onChange = (displayName?: string) =>
    onetimeList.addChild("singleTimeItem", {
      sectionValues: {
        ...(displayName && { displayNameEditor: displayName }),
      },
    });

  return (
    <ValueListGeneral
      {...{
        ...onetimeList.feInfo,
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
            {onetimeItems.map((item) => (
              <ListItemOneTime {...{ feId: item.feId, key: item.feId }} />
            ))}
          </VarbListTableSectionGeneric>
        ),
      }}
    />
  );
}
