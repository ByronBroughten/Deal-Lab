import styled from "styled-components";
import { CapExValueMode } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { LabelWithInfo } from "../../../../appWide/LabelWithInfo";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";
import { CapExValueList } from "./ValueShared.tsx/CapExListEditor";

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
    <Styled
      {...{
        label: (
          <LabelWithInfo
            {...{
              label: "Capital Expense Budget",
              infoTitle: "Capital Expense Budget - What's That?",
              infoText: `Capital Expenses, or CapEx, are those big, expensive things every property has that will eventually need to be replaced—things like the roof, furnace, and water heater. No long-term analysis of a property is complete without accounting for these inevitable costs.\n\nA common (and easy) method to account for these is to assume that all the CapEx costs together will average to about 5% of the property's rental income.\n\nA more precise method is to go through each major capital expense and estimate both how much it would cost to replace it and how many years the replacements will last. From there, the app will calculate how much you should budget per month for each capital expense as well as their total.`,
            }}
          />
        ),
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
          [
            "itemize",
            `Itemize lifespan over cost${
              valueMode === "itemize" ? "" : " (more accurate)"
            }`,
          ],
          ["lumpSum", "Custom amount"],
        ],
        equalsValue,
        itemizedModalTitle: "Itemized CapEx Budget",
        itemizeValue: "itemize",
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

const Styled = styled(SelectAndItemizeEditorSection)``;
