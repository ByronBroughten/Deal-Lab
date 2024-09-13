import { useAction } from "../../../../../../../../modules/stateHooks/useAction";
import { useGetterSection } from "../../../../../../../../modules/stateHooks/useGetterSection";
import { capExDisplayNames } from "../../../../../../../../sharedWithServer/StateOperators/exampleMakers/makeExamplePeriodicListProps";
import { SectionValues } from "../../../../../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue";
import { VarbListGenericMenuType } from "../../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListTableCapEx } from "../../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric/VarbListTableCapEx";
import { CapExItem } from "../../../../../../appWide/VarbLists/ListGroupPeriodicList/CapExItem";
import { ValueListGeneral } from "./ValueListGeneral";

type Props = { feId: string; menuType: VarbListGenericMenuType };
export function CapExValueList({ feId, menuType }: Props) {
  const addChild = useAction("addChild");

  const feInfo = { sectionName: "capExList", feId } as const;
  const capExList = useGetterSection(feInfo);

  const capExItems = capExList.children("capExItem");
  const itemDisplayNames = capExItems.map(
    (item) => item.valueNext("displayName").mainText
  );

  const totalVarb = capExList.varbNext("totalMonthly");
  const onChange = (displayName?: string) => {
    const sectionValues: Partial<SectionValues<"capExItem">> = {
      ...(displayName && { displayNameEditor: displayName }),
    };
    addChild({ feInfo, childName: "capExItem", options: { sectionValues } });
  };
  return (
    <ValueListGeneral
      {...{
        menuType,
        ...capExList.feInfo,
        onChange,
        menuDisplayNames: capExDisplayNames,
        itemDisplayNames: itemDisplayNames,
        routeBtnProps: {
          routeName: "capExListMain",
          title: "CapEx Lists",
        },
        table: (
          <VarbListTableCapEx
            {...{
              className: "CapExValueList-table",
              total: totalVarb.displayVarb(),
              addItem: () => onChange(),
            }}
          >
            {capExItems.map((item) => (
              <CapExItem
                {...{
                  sectionName: "capExItem",
                  feId: item.feId,
                  key: item.feId,
                }}
              />
            ))}
          </VarbListTableCapEx>
        ),
      }}
    />
  );
}
