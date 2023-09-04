import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { SelectEditor } from "../../../../../appWide/SelectEditor";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";

interface Props extends FeIdProp {
  percentDisplayVarb: string;
}
export function MortgageInsPeriodicValue({ feId, percentDisplayVarb }: Props) {
  const feInfo = { sectionName: "mortgageInsPeriodicValue", feId } as const;
  const mortgageInsPeriodic = useGetterSection(feInfo);

  const sourceName = mortgageInsPeriodic.valueNext("valueSourceName");
  return (
    <SelectEditor
      inputMargins
      {...{
        unionValueName: "mortgageInsPeriodicSource",
        label: "Ongoing",
        makeEditor: (props) => (
          <NumObjEntityEditor
            {...{
              ...props,
              feVarbInfo: {
                ...feInfo,
                varbName: sourceName,
              },
            }}
          />
        ),
        ...(sourceName === "percentLoanPeriodicEditor" && {
          equalsValue: percentDisplayVarb,
        }),
        sx: { ...nativeTheme.editorMargins },
        selectProps: { sx: { minWidth: 170 } },
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        items: [
          ["percentLoanPeriodicEditor", "Percent of loan"],
          ["valueDollarsPeriodicEditor", "Custom amount"],
        ],
      }}
    />
  );
}
