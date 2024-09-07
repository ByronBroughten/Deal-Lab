import { useGetterSection } from "../../../../../../../../stateHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../../theme/nativeTheme";
import { SelectEditor } from "../../../../../../appWide/SelectEditor";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";

type Props = { feId: string; totalDisplayVarb: string };
export function MortgageInsUpfrontValue({ feId, totalDisplayVarb }: Props) {
  const feInfo = { sectionName: "mortgageInsUpfrontValue", feId } as const;
  const mortInsValue = useGetterSection(feInfo);
  const sourceName = mortInsValue.valueNext("valueSourceName");
  const feVarbInfo = { ...feInfo, varbName: "valueSourceName" } as const;
  return (
    <SelectEditor
      {...{
        sx: { paddingTop: nativeTheme.s45 },
        selectProps: { sx: { minWidth: 140 } },
        feVarbInfo,
        unionValueName: "mortgageInsUpfrontSource",
        label: "Upfront",
        makeEditor: (props) => (
          <NumObjEntityEditor
            {...{
              ...props,
              labelProps: { showLabel: false },
              feVarbInfo: mortInsValue.varbInfo2(sourceName),
              quickViewVarbNames: ["numUnits"],
            }}
          />
        ),
        items: [
          ["percentLoanEditor", "Percent of loan"],
          ["valueDollarsEditor", "Custom amount"],
        ],
        ...(sourceName === "percentLoanEditor" && {
          equalsValue: totalDisplayVarb,
        }),
      }}
    />
  );
}
