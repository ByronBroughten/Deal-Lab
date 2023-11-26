import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { PeriodicEditor } from "../../../../../../inputs/PeriodicEditor";
import { PeriodicList } from "../../ValueShared/PeriodicList";

export function MiscHoldingCost({ feId }: { feId: string }) {
  const feInfo = { sectionName: "miscPeriodicValue", feId } as const;
  const holdingCost = useGetterSection(feInfo);
  const editor = holdingCost.onlyChild("periodicEditor");
  const freq = editor.valueNext("valueEditorFrequency");
  const valueVarb = holdingCost.periodicVarb("valueDollars", freq);

  const sourceName = holdingCost.valueNext("valueSourceName");

  const menuDisplayNames = [
    "HOA Fees",
    "Landscaping",
    "Accounting",
    "Legal",
  ] as const;

  return (
    <SelectAndItemizeEditor
      inputMargins
      {...{
        unionValueName: "dollarsOrListOngoing",
        label: "Misc holding costs",
        itemizedModalTitle: "Misc holding costs",
        makeEditor:
          sourceName === "valueDollarsEditor"
            ? (props) => (
                <PeriodicEditor
                  {...{
                    ...props,
                    feId: editor.feId,
                    labelProps: { showLabel: false },
                    labelInfo: holdingCost.periodicVBI("valueDollars"),
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
              feId: holdingCost.oneChildFeId("periodicList"),
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
