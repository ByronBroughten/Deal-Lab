import { FeIdProp } from "../../../../../../../../sharedWithServer/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../../stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { PeriodicEditor } from "../../../../../../inputs/PeriodicEditor";
import { PeriodicList } from "../../ValueShared/PeriodicList";

interface Props extends FeIdProp {
  menuDisplayNames: string[];
}
export function MiscOngoingCost({ feId, menuDisplayNames }: Props) {
  const feInfo = { sectionName: "miscPeriodicValue", feId } as const;
  const miscValue = useGetterSection(feInfo);
  const editor = miscValue.onlyChild("valueDollarsEditor");
  const valueVarb = miscValue.varbNext("valueDollarsMonthly");
  const sourceName = miscValue.valueNext("valueSourceName");
  return (
    <SelectAndItemizeEditor
      inputMargins
      {...{
        unionValueName: "dollarsOrListOngoing",
        label: "Misc ongoing costs",
        itemizedModalTitle: "Misc ongoing costs",
        makeEditor:
          sourceName === "valueDollarsEditor"
            ? (props) => (
                <PeriodicEditor
                  {...{
                    ...props,
                    feId: editor.feId,
                    labelProps: { showLabel: false },
                    labelInfo: miscValue.periodicVBI("valueDollars"),
                  }}
                />
              )
            : undefined,
        sx: { ...nativeTheme.editorMargins },
        selectProps: { sx: { minWidth: 170 } },
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        items: [
          ["valueDollarsEditor", "Custom amount"],
          ["listTotal", "Itemize"],
        ],
        itemizeValue: "listTotal",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <PeriodicList
            {...{
              menuDisplayNames,
              feId: miscValue.oneChildFeId("periodicList"),
              menuType: "value",
              routeBtnProps: {
                title: "Misc Ongoing Lists",
                routeName: "ongoingListMain",
              },
            }}
          />
        ),
      }}
    />
  );
}
