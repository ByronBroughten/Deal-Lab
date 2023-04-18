import { FeVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
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
  const vacancyLoss = useSetterSection({
    sectionName: "loanBaseValue",
    feId,
  });
  const { editorProps, equalsValue } = getProps(vacancyLoss.get);
  const valueSourceName = vacancyLoss.value("valueSourceName");
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
          const value = e.target.value as string;
          vacancyLoss.varb("valueSourceName").updateValue(value);
        },
        menuItems,
        equalsValue,
      }}
    />
  );
}
