import styled from "styled-components";
import { useSetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../../../theme/Theme";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { VarbListGenericMenuType } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListTableCapEx } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListGeneric/VarbListTableCapEx";
import { VarbListMenuDual } from "../../../../../appWide/ListGroup/ListGroupShared/VarbListMenuDual";
import { ListItemCapExNext } from "../../../../../appWide/VarbLists/VarbListOngoing/ListItemCapExNext";
import { CheckboxList } from "./CheckboxList";

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
  const itemNames = capExItems.map(
    (item) => item.valueNext("displayName").mainText
  );
  const unusedDisplayNames = capExDisplayNames.filter(
    (name) => !itemNames.includes(name)
  );

  const itemOngoingSwitch = capExList.value("itemOngoingSwitch");

  const totalVarb = capExList.get.activeSwitchTarget("total", "ongoing");
  return (
    <Styled>
      <VarbListMenuDual
        {...{
          ...capExList.feInfo,
          menuType,
          className: "CapExValueList-menu",
        }}
      />

      <FormSectionLabeled
        label={"Common Items"}
        className="CapExValueList-itemSection"
      >
        <CheckboxList
          {...{
            checkboxProps: unusedDisplayNames.map((displayName) => ({
              checked: false,
              onChange: () =>
                capExList.addChild("capExItem", {
                  dbVarbs: { displayNameEditor: displayName },
                }),
              label: displayName,
              name: displayName,
            })),
          }}
        />
        <VarbListTableCapEx
          {...{
            className: "CapExValueList-table",
            total: totalVarb.displayVarb(),
            addItem: () =>
              capExList.addChild("capExItem", {
                dbVarbs: { valueOngoingSwitch: itemOngoingSwitch },
              }),
          }}
        >
          {capExItems.map((item) => (
            <ListItemCapExNext
              {...{
                sectionName: "capExItem",
                feId: item.feId,
                key: item.feId,
              }}
            />
          ))}
        </VarbListTableCapEx>
      </FormSectionLabeled>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  .CapExValueList-menu {
    padding-bottom: ${theme.s3};
  }
  .CapExValueList-checkBoxList {
    padding-top: ${theme.s2};
  }
  .CapExValueList-table {
    margin-top: ${theme.s4};
  }
  .CapExValueList-itemSection {
    flex-direction: column;
  }
  .CapExValueList-dividerRow {
  }
  .CapExValueList-dividerCell {
    background-color: ${theme["gray-200"]};
  }
  .CapExValueList-customDividerSpan {
  }
`;
