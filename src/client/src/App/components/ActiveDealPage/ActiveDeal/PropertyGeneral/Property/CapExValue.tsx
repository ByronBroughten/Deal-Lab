import {
  capExDescription,
  capExItemizeDescription,
} from "../../../../../Constants/descriptions";
import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { LabelWithInfo } from "../../../../appWide/LabelWithInfo";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";
import { CapExValueList } from "./ValueShared.tsx/CapExListEditor";

export function CapExValue({ feId }: { feId: string }) {
  const capExValue = useSetterSection({
    sectionName: "capExValue",
    feId,
  });
  const valueSourceName = capExValue.value("valueSourceName");
  const valueVarb = capExValue.get.switchVarb("value", "ongoing");
  const showEquals: StateValue<"capExValueSource">[] = ["fivePercentRent"];
  const equalsValue = showEquals.includes(valueSourceName)
    ? valueVarb.displayVarb()
    : undefined;

  const menuItems: [StateValue<"capExValueSource">, string][] = [
    [
      "fivePercentRent",
      `5% of rent${valueSourceName === "fivePercentRent" ? "" : " (simplest)"}`,
    ],
    [
      "listTotal",
      `Itemize lifespan over cost${
        valueSourceName === "listTotal" ? "" : " (more accurate)"
      }`,
    ],
    ["valueEditor", "Custom amount"],
  ];

  return (
    <SelectAndItemizeEditorSection
      {...{
        label: (
          <LabelWithInfo
            {...{
              label: "Capital Expense Budget",
              infoTitle: "Capital Expense Budget - What's That?",
              infoText: capExDescription,
            }}
          />
        ),
        selectValue: valueSourceName,
        onChange: (e) => {
          const value = e.target.value as string;
          capExValue.varb("valueSourceName").updateValue(value);
        },
        menuItems,
        equalsValue,
        itemizedModalTitle: (
          <LabelWithInfo
            {...{
              label: "Itemized CapEx Budget",
              infoTitle: "How to Itemize CapEx Expenses",
              infoText: capExItemizeDescription,
            }}
          />
        ),
        itemizeValue: "listTotal",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <CapExValueList
            {...{
              feId: capExValue.oneChildFeId("capExList"),
              menuType: "value",
            }}
          />
        ),
      }}
    />
  );
}
