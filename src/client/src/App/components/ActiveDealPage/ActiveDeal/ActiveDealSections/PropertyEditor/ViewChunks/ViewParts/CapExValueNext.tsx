import {
  capExDescription,
  capExItemizeDescription,
} from "../../../../../../../Constants/descriptions";
import { StateValue } from "../../../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { LabelWithInfo } from "../../../../../../appWide/LabelWithInfo";
import { SelectAndItemizeEditorNext } from "../../../../../../appWide/SelectAndItemizeEditorNext";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { CapExValueList } from "../../ValueShared/CapExListEditor";

export function CapExValueNext({ feId }: { feId: string }) {
  const feInfo = { sectionName: "capExValue", feId } as const;
  const capExValue = useGetterSection(feInfo);
  const valueSourceName = capExValue.valueNext("valueSourceName");
  const valueVarb = capExValue.switchVarb("value", "ongoing");

  const showEquals: StateValue<"capExValueSource">[] = ["fivePercentRent"];
  const equalsValue = showEquals.includes(valueSourceName)
    ? valueVarb.displayVarb()
    : undefined;

  return (
    <SelectAndItemizeEditorNext
      {...{
        selectProps: { sx: { minWidth: 170 } },
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        total: valueVarb.displayVarb(),
        unionValueName: "capExValueSource",
        items: [
          [
            "fivePercentRent",
            `5% of rent${
              valueSourceName === "fivePercentRent" ? "" : " (simplest)"
            }`,
          ],
          [
            "listTotal",
            `Itemize lifespan over cost${
              valueSourceName === "listTotal" ? "" : " (more accurate)"
            }`,
          ],
          ["valueEditor", "Custom amount"],
        ],
        label: (
          <LabelWithInfo
            {...{
              label: "Capital Expenses",
              infoTitle: "Capital Expenses - What are those?",
              infoText: capExDescription,
            }}
          />
        ),
        selectValue: valueSourceName,
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
