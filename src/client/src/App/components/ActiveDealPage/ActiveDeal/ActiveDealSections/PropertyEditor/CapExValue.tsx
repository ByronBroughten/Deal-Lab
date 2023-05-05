import {
  capExDescription,
  capExItemizeDescription,
} from "../../../../../Constants/descriptions";
import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { validateStateValue } from "../../../../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useAction } from "../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { LabelWithInfo } from "../../../../appWide/LabelWithInfo";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { CapExValueList } from "./ValueShared.tsx/CapExListEditor";

export function CapExValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "capExValue", feId } as const;
  const updateValue = useAction("updateValue");
  const capExValue = useGetterSection(feInfo);
  const valueSourceName = capExValue.valueNext("valueSourceName");
  const valueVarb = capExValue.switchVarb("value", "ongoing");
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

  if (valueSourceName === "none") {
    menuItems.push(["none", "Choose method"]);
  }

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
          updateValue({
            ...feInfo,
            varbName: "valueSourceName",
            value: validateStateValue(e.target.value, "capExValueSource"),
          });
        },
        makeEditor:
          valueSourceName === "valueEditor"
            ? (props) => (
                <NumObjEntityEditor
                  {...{
                    ...props,
                    feVarbInfo: capExValue.varbInfo("valueDollarsEditor"),
                  }}
                />
              )
            : undefined,
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
