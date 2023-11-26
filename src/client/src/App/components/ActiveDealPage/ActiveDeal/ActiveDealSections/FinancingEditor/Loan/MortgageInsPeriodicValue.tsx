import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { SelectEditor } from "../../../../../appWide/SelectEditor";
import { PeriodicEditor } from "../../../../../inputs/PeriodicEditor";

interface Props extends FeIdProp {
  dollarsDisplay: string;
}
export function MortgageInsPeriodicValue({ feId, dollarsDisplay }: Props) {
  const feInfo = { sectionName: "mortgageInsPeriodicValue", feId } as const;
  const mortIns = useGetterSection(feInfo);
  const sourceName = mortIns.valueNext("valueSourceName");

  const labelInfos = {
    dollarsEditor: mortIns.periodicVBI("valueDollars"),
    percentEditor: mortIns.periodicVBI("percentLoan"),
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
        ...(sourceName === "percentEditor" && {
          equalsValue: dollarsDisplay,
        }),
        sx: { ...nativeTheme.editorMargins },
        selectProps: { sx: { minWidth: 170 } },
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        items: [
          ["percentEditor", "Percent of loan"],
          ["dollarsEditor", "Custom amount"],
        ],
      }}
    />
  );
}
