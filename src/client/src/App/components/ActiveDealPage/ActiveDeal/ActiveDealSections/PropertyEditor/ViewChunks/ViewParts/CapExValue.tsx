import { capExItemizeDescription } from "../../../../../../../../varbLabels";
import { StateValue } from "../../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { LabelWithInfo } from "../../../../../../appWide/LabelWithInfo";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { VarbStringLabel } from "../../../../../../appWide/VarbStringLabel";
import { PeriodicEditor } from "../../../../../../inputs/PeriodicEditor";
import { CapExValueList } from "../../ValueShared/CapExListEditor";

export function CapExValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "capExValue", feId } as const;
  const capExValue = useGetterSection(feInfo);
  const editor = capExValue.onlyChild("valueDollarsEditor");
  const freq = editor.valueNext("valueEditorFrequency");

  const valueSourceName = capExValue.valueNext("valueSourceName");
  const valueVarb = capExValue.periodicVarb("valueDollars", freq);

  const showEquals: StateValue<"capExValueSource">[] = ["fivePercentRent"];
  const equalsValue = showEquals.includes(valueSourceName)
    ? valueVarb.displayVarb()
    : undefined;
  const feVarbInfo = { ...feInfo, varbName: "valueSourceName" } as const;
  return (
    <SelectAndItemizeEditor
      inputMargins
      {...{
        unionValueName: "capExValueSource",
        selectProps: { sx: { minWidth: 170 } },
        feVarbInfo,
        total: valueVarb.displayVarb(),
        items: [
          // [
          //   "fivePercentRent",
          //   `5% of rent${
          //     valueSourceName === "fivePercentRent" ? "" : " (simplest)"
          //   }`,
          // ],
          [
            "listTotal",
            `Itemize${valueSourceName === "listTotal" ? "" : " (recommended)"}`,
          ],
          ["valueDollarsEditor", "Custom amount"],
        ],
        label: <VarbStringLabel names={feVarbInfo} />,
        selectValue: valueSourceName,
        makeEditor:
          valueSourceName === "valueDollarsEditor"
            ? (props) => (
                <PeriodicEditor
                  {...{
                    ...props,
                    feId: capExValue.onlyChildFeId("valueDollarsEditor"),
                    labelInfo: capExValue.periodicVBI("valueDollars"),
                    labelProps: { showLabel: false },
                  }}
                />
              )
            : undefined,
        equalsValue,
        itemizedModalTitle: (
          <LabelWithInfo
            {...{
              label: "Capital Expense Budget",
              infoProps: {
                title: "How to Itemize CapEx",
                info: capExItemizeDescription,
              },
            }}
          />
        ),
        itemizeValue: "listTotal",
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
