import { capExDisplayNames } from "../../../../../../sharedWithServer/defaultMaker/makeDefaultFeUser/makeExampleOngoingListsProps";
import { SectionValues } from "../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useAction } from "../../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { VarbListGenericMenuType } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListTableCapEx } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric/VarbListTableCapEx";
import { ListItemCapEx } from "../../../../../appWide/VarbLists/VarbListOngoing/ListItemCapEx";
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

  const itemPeriodicSwitch = capExList.valueNext("itemPeriodicSwitch");
  const totalVarb = capExList.activeSwitchTarget("total", "periodic");

  const onChange = (displayName?: string) => {
    const sectionValues: Partial<SectionValues<"capExItem">> = {
      valueDollarsPeriodicSwitch: itemPeriodicSwitch,
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
              <ListItemCapEx
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
