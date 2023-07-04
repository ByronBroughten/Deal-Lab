import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { ListEditorOngoing } from "../../ValueShared/ListEditorOngoing";

export function MiscIncomeValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "miscRevenueValue", feId } as const;
  const incomeValue = useGetterSection(feInfo);

  const valueVarb = incomeValue.switchVarb("valueDollars", "periodic");
  const sourceName = incomeValue.valueNext("valueSourceName");
  const menuDisplayNames = ["Laundry", "Parking", "Storage"] as const;
  return (
    <SelectAndItemizeEditor
      {...{
        unionValueName: "dollarsOrListOngoing",
        label: "Misc income",
        itemizedModalTitle: "Misc Income",
        makeEditor:
          sourceName === "valueDollarsPeriodicEditor"
            ? (props) => (
                <NumObjEntityEditor
                  {...{
                    ...props,
                    feVarbInfo: {
                      ...feInfo,
                      varbName: "valueDollarsPeriodicEditor",
                    },
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
          ["valueDollarsPeriodicEditor", "Amount"],
          ["listTotal", "Itemize"],
        ],
        itemizeValue: "listTotal",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <ListEditorOngoing
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
