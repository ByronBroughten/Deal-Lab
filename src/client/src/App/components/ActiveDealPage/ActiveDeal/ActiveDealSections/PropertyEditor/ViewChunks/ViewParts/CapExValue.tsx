import { capExItemizeDescription } from "../../../../../../../../varbLabels";
import { StateValue } from "../../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { LabelWithInfo } from "../../../../../../appWide/LabelWithInfo";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { VarbStringLabel } from "../../../../../../appWide/VarbStringLabel";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { CapExValueList } from "../../ValueShared/CapExListEditor";

export function CapExValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "capExValue", feId } as const;
  const capExValue = useGetterSection(feInfo);
  const valueSourceName = capExValue.valueNext("valueSourceName");
  const valueVarb = capExValue.switchVarb("valueDollars", "periodic");

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
          [
            "fivePercentRent",
            `5% of rent${
              valueSourceName === "fivePercentRent" ? "" : " (simplest)"
            }`,
          ],
          [
            "listTotal",
            `Itemize${
              valueSourceName === "listTotal"
                ? ""
                : " (more precise, recommended)"
            }`,
          ],
          ["valueDollarsPeriodicEditor", "Custom amount"],
        ],
        label: <VarbStringLabel names={feVarbInfo} />,
        selectValue: valueSourceName,
        makeEditor:
          valueSourceName === "valueDollarsPeriodicEditor"
            ? (props) => (
                <NumObjEntityEditor
                  {...{
                    ...props,
                    feVarbInfo: capExValue.varbInfo(valueSourceName),
                  }}
                />
              )
            : undefined,
        equalsValue,
        itemizedModalTitle: (
          <LabelWithInfo
            {...{
              label: "Capital Expense Budget",
              infoTitle: "How to Itemize CapEx",
              infoText: capExItemizeDescription,
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
