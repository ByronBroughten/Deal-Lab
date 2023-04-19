import { FeVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { validateStateValue } from "../../../../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useAction } from "../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { ValueFixedVarbPathName } from "../../../../../sharedWithServer/StateEntityGetters/ValueInEntityInfo";
import { GetterSection } from "../../../../../sharedWithServer/StateGetters/GetterSection";
import { SelectEditorSection } from "../../../../appWide/SelectEditorSection";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

function getProps(getter: GetterSection<"loanBaseValue">): {
  equalsValue?: string;
  editorProps?: {
    quickViewVarbNames: ValueFixedVarbPathName[];
    feVarbInfo: FeVarbInfo;
  };
} {
  const valueSourceName = getter.valueNext("valueSourceName");
  const dollarsVarb = getter.varbNext("valueDollars");
  switch (valueSourceName) {
    case "none":
      return {};
    case "eightyFivePercentAsset":
      return { equalsValue: dollarsVarb.displayVarb() };
    case "percentOfAssetEditor":
      return {
        equalsValue: dollarsVarb.displayVarb(),
        editorProps: {
          feVarbInfo: getter.varbNext("valuePercentEditor").feVarbInfo,
          quickViewVarbNames: ["purchasePrice", "upfrontRepairCost"],
        },
      };
    case "dollarsEditor": {
      return {
        equalsValue: `${getter.displayVarb("valuePercent")}`,
        editorProps: {
          feVarbInfo: getter.varbNext("valueDollarsEditor").feVarbInfo,
          quickViewVarbNames: ["purchasePrice", "upfrontRepairCost"],
        },
      };
    }
  }
}

export function LoanBaseValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "loanBaseValue", feId } as const;
  const updateValue = useAction("updateValue");
  const vacancyLoss = useGetterSection(feInfo);
  const { editorProps, equalsValue } = getProps(vacancyLoss);
  const valueSourceName = vacancyLoss.valueNext("valueSourceName");
  const menuItems: [StateValue<"loanBaseValueSource">, string][] = [
    [
      "eightyFivePercentAsset",
      `85% ${
        valueSourceName === "eightyFivePercentAsset"
          ? ""
          : " (common owner occupy)"
      }`,
    ],
    ["dollarsEditor", "Custom dollar amount"],
    ["percentOfAssetEditor", "Custom percent"],
  ];

  return (
    <SelectEditorSection
      {...{
        label: "Loan Amount",
        makeEditor: editorProps
          ? (props) => (
              <NumObjEntityEditor
                {...{
                  ...props,
                  ...editorProps,
                }}
              />
            )
          : undefined,
        selectValue: valueSourceName,
        onChange: (e) => {
          updateValue({
            ...feInfo,
            varbName: "valueSourceName",
            value: validateStateValue(e.target.value, "loanBaseValueSource"),
          });
        },
        menuItems,
        equalsValue,
      }}
    />
  );
}
