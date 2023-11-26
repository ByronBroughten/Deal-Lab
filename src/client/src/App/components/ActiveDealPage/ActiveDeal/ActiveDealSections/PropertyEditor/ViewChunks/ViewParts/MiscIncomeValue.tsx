import { periodicName } from "../../../../../../../sharedWithServer/SectionsMeta/GroupName";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { PeriodicEditor } from "../../../../../../inputs/PeriodicEditor";
import { PeriodicList } from "../../ValueShared/PeriodicList";

export function MiscIncomeValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "miscPeriodicValue", feId } as const;
  const incomeValue = useGetterSection(feInfo);

  const editor = incomeValue.onlyChild("periodicEditor");
  const freq = editor.valueNext("valueEditorFrequency");
  const valueVarb = incomeValue.varbNext(periodicName("valueDollars", freq));
  const sourceName = incomeValue.valueNext("valueSourceName");
  const menuDisplayNames = ["Laundry", "Parking", "Storage"] as const;
  return (
    <SelectAndItemizeEditor
      {...{
        unionValueName: "dollarsOrListOngoing",
        label: "Misc income",
        itemizedModalTitle: "Misc Income",
        makeEditor:
          sourceName === "valueDollarsEditor"
            ? (props) => (
                <PeriodicEditor
                  {...{
                    ...props,
                    feId: incomeValue.onlyChildFeId("periodicEditor"),
                    labelProps: { showLabel: false },
                    labelInfo: incomeValue.periodicVBI("valueDollars"),
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
              feId: incomeValue.oneChildFeId("periodicList"),
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
