import { FeIdProp } from "../../../../../../../../sharedWithServer/StateGetters/Identifiers/NanoIdInfo";
import { useGetterSection } from "../../../../../../../../stateHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../../theme/nativeTheme";
import { SelectEditor } from "../../../../../../appWide/SelectEditor";
import { PeriodicEditor } from "../../../../../../inputs/PeriodicEditor";

interface Props extends FeIdProp {
  dollarsDisplay: string;
}
export function MortgageInsPeriodicValue({ feId, dollarsDisplay }: Props) {
  const feInfo = { sectionName: "mortgageInsPeriodicValue", feId } as const;
  const mortIns = useGetterSection(feInfo);
  const sourceName = mortIns.valueNext("valueSourceName");

  const labelInfos = {
    valueDollarsEditor: mortIns.periodicVBI("valueDollars"),
    valuePercentEditor: mortIns.periodicVBI("percentLoan"),
  } as const;

  return (
    <SelectEditor
      inputMargins
      {...{
        unionValueName: "mortgageInsPeriodic",
        label: "Ongoing",
        makeEditor: (props) => (
          <PeriodicEditor
            {...{
              ...props,
              feId: mortIns.onlyChildFeId(sourceName),
              labelInfo: labelInfos[sourceName],
              labelProps: { showLabel: false },
            }}
          />
        ),
        ...(sourceName === "valuePercentEditor" && {
          equalsValue: dollarsDisplay,
        }),
        sx: { ...nativeTheme.editorMargins },
        selectProps: { sx: { minWidth: 170 } },
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        items: [
          ["valuePercentEditor", "Percent of loan"],
          ["valueDollarsEditor", "Enter amount"],
        ],
      }}
    />
  );
}
