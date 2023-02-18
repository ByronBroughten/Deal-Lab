import { useSetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VarbListGenericMenuType } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListTableSectionGeneric } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric/VarbListTableSectionGeneric";
import { ListItemSingleTime } from "../../../../../appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime/ListItemSingleTime";
import { ValueListGeneral } from "./ValueListGeneral";

type Props = {
  feId: string;
  menuType: VarbListGenericMenuType;
  menuDisplayNames?: readonly string[];
};
export function ListEditorSingleTime({
  feId,
  menuType,
  menuDisplayNames,
}: Props) {
  const singleTimeList = useSetterSection({
    sectionName: "singleTimeList",
    feId,
  });

  const singleTimeItems = singleTimeList.get.children("singleTimeItem");

  const itemDisplayNames = singleTimeItems.map(
    (item) => item.valueNext("displayName").mainText
  );

  const totalVarb = singleTimeList.get.varbNext("total");

  const onChange = (displayName?: string) =>
    singleTimeList.addChild("singleTimeItem", {
      dbVarbs: {
        ...(displayName && { displayNameEditor: displayName }),
      },
    });

  return (
    <ValueListGeneral
      {...{
        ...singleTimeList.feInfo,
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
            {singleTimeItems.map((item) => (
              <ListItemSingleTime {...{ feId: item.feId, key: item.feId }} />
            ))}
          </VarbListTableSectionGeneric>
        ),
      }}
    />
  );
}
