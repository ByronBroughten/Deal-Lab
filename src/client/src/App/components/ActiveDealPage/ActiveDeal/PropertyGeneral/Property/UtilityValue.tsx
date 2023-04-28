import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { validateStateValue } from "../../../../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useAction } from "../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";
import { ListEditorOngoing } from "./ValueShared.tsx/ListEditorOngoing";

export function UtilityValue({
  feId,
  labeled,
}: {
  feId: string;
  labeled?: boolean;
}) {
  const feInfo = { sectionName: "utilityValue", feId } as const;
  const updateValue = useAction("updateValue");
  const utilityValue = useGetterSection(feInfo);
  const valueSourceName = utilityValue.valueNext("valueSourceName");
  const valueVarb = utilityValue.switchVarb("value", "ongoing");
  const equalsValue = valueSourceName === "zero" ? "$0" : undefined;

  const menuItems: [StateValue<"utilityValueSource">, string][] = [
    ["zero", "Tenant pays all utilities"],
    ["listTotal", "Itemize"],
  ];

  if (valueSourceName === "none") {
    menuItems.push(["none", "Choose method"]);
  }

  return (
    <SelectAndItemizeEditorSection
      {...{
        label: "Utility Costs",
        selectValue: valueSourceName,
        onChange: (e) => {
          updateValue({
            ...feInfo,
            varbName: "valueSourceName",
            value: validateStateValue(e.target.value, "utilityValueSource"),
          });
        },
        menuItems,
        equalsValue,
        itemizedModalTitle: "Utilities",
        itemizeValue: "listTotal",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <ListEditorOngoing
            {...{
              feId: utilityValue.oneChildFeId("ongoingList"),
              menuType: "value",
              routeBtnProps: {
                title: "Utility Lists",
                routeName: "utilitiesListMain",
              },
              menuDisplayNames: [
                "Water/sewer",
                "Garbage",
                "Heat",
                "Misc energy",
              ],
            }}
          />
        ),
      }}
    />
  );
}
