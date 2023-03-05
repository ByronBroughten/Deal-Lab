import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";
import { ListEditorOngoing } from "./ValueShared.tsx/ListEditorOngoing";

export function UtilityValue({ feId }: { feId: string }) {
  const utilityValue = useSetterSection({
    sectionName: "utilityValue",
    feId,
  });
  const valueSourceName = utilityValue.value("valueSourceName");
  const valueVarb = utilityValue.get.switchVarb("value", "ongoing");
  const equalsValue = valueSourceName === "zero" ? "$0" : undefined;

  const menuItems: [StateValue<"utilityValueSource">, string][] = [
    ["zero", "Tenant pays all utilities"],
    ["listTotal", "Itemize"],
  ];

  return (
    <SelectAndItemizeEditorSection
      {...{
        label: "Utility Costs",
        selectValue: valueSourceName,
        onChange: (e) => {
          const value = e.target.value as string;
          utilityValue.varb("valueSourceName").updateValue(value);
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
