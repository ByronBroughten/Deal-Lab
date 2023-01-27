import { UtilityValueMode } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/subValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { SelectAndItemizeEditor } from "../../../../appWide/SelectAndItemizeEditor";
import { VarbListOngoing } from "../../../../appWide/VarbLists/VarbListOngoing";

export function UtilityValue({ feId }: { feId: string }) {
  const utilityValue = useSetterSection({
    sectionName: "utilityValue",
    feId,
  });
  const valueMode = utilityValue.value("valueMode") as UtilityValueMode;
  const valueVarb = utilityValue.get.switchVarb("value", "ongoing");
  const equalsValue = valueMode === "tenantUtilities" ? "$0" : undefined;
  return (
    <SelectAndItemizeEditor
      {...{
        label: "Utilities",
        selectValue: valueMode,
        onChange: (e) => {
          const value = e.target.value as string;
          utilityValue.varb("valueMode").updateValue(value);
        },
        menuItems: [
          ["tenantUtilities", "Tenant pays all utilities"],
          ["itemize", "Itemize"],
        ],
        equalsValue,
        itemizedModalTitle: "Utilities",
        itemizeValue: "itemize",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <VarbListOngoing
            {...{
              feId: utilityValue.oneChildFeId("ongoingList"),
              menuType: "value",
            }}
          />
        ),
      }}
    />
  );
}
