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

  const itemOngoingSwitch = capExList.value("itemOngoingSwitch");
  const totalVarb = capExList.get.activeSwitchTarget("total", "ongoing");

  const onChange = (displayName?: string) =>
    capExList.addChild("capExItem", {
      dbVarbs: {
        valueOngoingSwitch: itemOngoingSwitch,
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
