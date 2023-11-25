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
  const mortgageInsPeriodic = useGetterSection(feInfo);
  const sourceName = mortgageInsPeriodic.valueNext("valueSourceName");
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
              feId: mortgageInsPeriodic.onlyChildFeId(sourceName),
              labelNames: { sectionName: "loan", varbBaseName: "mortgageIns" },
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
