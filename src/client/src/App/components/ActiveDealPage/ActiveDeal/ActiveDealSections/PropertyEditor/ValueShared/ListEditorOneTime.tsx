import { SectionValues } from "../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useAction } from "../../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { ListItemOneTime } from "../../../../../appWide/ListGroup/ListGroupOneTime/VarbListOneTime/ListItemOneTime";
import { VarbListGenericMenuType } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListStandardHeaders } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric/VarbListStandardHeaders";
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
  const addChild = useAction("addChild");
  const feInfo = { sectionName: "onetimeList", feId } as const;

  const onetimeList = useGetterSection(feInfo);
  const onetimeItems = onetimeList.children("singleTimeItem");

  const itemDisplayNames = onetimeItems.map(
    (item) => item.valueNext("displayName").mainText
  );

  const totalVarb = onetimeList.varbNext("total");
  const onChange = (displayName?: string) => {
    const sectionValues: Partial<SectionValues<"singleTimeItem">> = {
      ...(displayName && { displayNameEditor: displayName }),
    };
    addChild({
      feInfo,
      childName: "singleTimeItem",
      options: { sectionValues },
    });
  };

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
              headers: <VarbListStandardHeaders contentTitle={"Cost"} />,
              varbListTotal: totalVarb.displayVarb(),
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
