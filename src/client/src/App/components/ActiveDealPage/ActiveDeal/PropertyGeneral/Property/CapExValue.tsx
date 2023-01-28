import { CapExValueMode } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/subValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { SelectAndItemizeEditor } from "../../../../appWide/SelectAndItemizeEditor";
import { VarbListCapEx } from "../../../../appWide/VarbLists/VarbListCapEx";

export function CapExValue({ feId }: { feId: string }) {
  const capExValue = useSetterSection({
    sectionName: "capExValue",
    feId,
  });
  const valueMode = capExValue.value("valueMode") as CapExValueMode;
  const valueVarb = capExValue.get.switchVarb("value", "ongoing");
  const showEquals: CapExValueMode[] = ["fivePercentRent"];
  const equalsValue = showEquals.includes(valueMode)
    ? valueVarb.displayVarb()
    : undefined;
  return (
    <SelectAndItemizeEditor
      {...{
        label: "Capital Expense Budget",
        selectValue: valueMode,
        onChange: (e) => {
          const value = e.target.value as string;
          capExValue.varb("valueMode").updateValue(value);
        },
        menuItems: [
          [
            "fivePercentRent",
            `5% of rent${valueMode === "fivePercentRent" ? "" : " (simplest)"}`,
          ],
          ["itemize", "Itemize lifespan over cost (most accurate)"],
          ["lumpSum", "Custom amount"],
        ],
        equalsValue,
        itemizedModalTitle: "CapEx Budget Itemizer",
        itemizeValue: "itemize",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <VarbListCapEx
            {...{
              feId: capExValue.oneChildFeId("capExListNext"),
              menuType: "value",
            }}
          />
        ),
      }}
    />
  );
}
