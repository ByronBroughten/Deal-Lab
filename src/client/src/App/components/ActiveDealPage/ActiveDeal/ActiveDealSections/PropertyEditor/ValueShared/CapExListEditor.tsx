import { useSetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VarbListGenericMenuType } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListTableCapEx } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric/VarbListTableCapEx";
import { ListItemCapEx } from "../../../../../appWide/VarbLists/VarbListOngoing/ListItemCapEx";
import { ValueListGeneral } from "./ValueListGeneral";

const capExDisplayNames = [
  "Appliances",
  "Cabinets & counters",
  "Driveway",
  "Flooring",
  "Garage door",
  "HVAC",
  "Interior paint",
  "Landscaping",
  "Laundry",
  "Plumbing",
  "Roof",
  "Siding",
  "Structure",
  "Water heater",
  "Windows",
] as const;

type Props = { feId: string; menuType: VarbListGenericMenuType };
export function CapExValueList({ feId, menuType }: Props) {
  const capExList = useSetterSection({
    sectionName: "capExList",
    feId,
  });

  const capExItems = capExList.get.children("capExItem");
  const itemDisplayNames = capExItems.map(
    (item) => item.valueNext("displayName").mainText
  );

  const itemPeriodicSwitch = capExList.value("itemPeriodicSwitch");
  const totalVarb = capExList.get.activeSwitchTarget("total", "periodic");

  const onChange = (displayName?: string) =>
    capExList.addChild("capExItem", {
      sectionValues: {
        valuePeriodicSwitch: itemPeriodicSwitch,
        ...(displayName && { displayNameEditor: displayName }),
      },
    });

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
