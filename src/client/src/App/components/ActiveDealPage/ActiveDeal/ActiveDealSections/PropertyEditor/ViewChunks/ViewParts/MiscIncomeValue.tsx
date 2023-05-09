import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import { SelectAndItemizeEditorNext } from "../../../../../../appWide/SelectAndItemizeEditorNext";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { ListEditorOngoing } from "../../ValueShared/ListEditorOngoing";

export function MiscIncomeValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "miscRevenueValue", feId } as const;
  const incomeValue = useGetterSection(feInfo);

  const valueVarb = incomeValue.switchVarb("valueDollars", "ongoing");
  const sourceName = incomeValue.valueNext("valueSourceName");
  const menuDisplayNames = ["Laundry", "Parking", "Storage"] as const;
  return (
    <SelectAndItemizeEditorNext
      {...{
        label: "Misc income",
        itemizedModalTitle: "Misc Income",
        makeEditor:
          sourceName === "valueDollarsEditor"
            ? (props) => (
                <NumObjEntityEditor
                  {...{
                    ...props,
                    feVarbInfo: {
                      ...feInfo,
                      varbName: "valueDollarsOngoingEditor",
                    },
                  }}
                />
              )
            : undefined,
        sx: { ...nativeTheme.editorMargins },
        selectProps: { sx: { minWidth: 170 } },
        unionValueName: "dollarsOrList",
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        items: [
          ["valueDollarsEditor", "Amount"],
          ["listTotal", "Itemize"],
        ],
        itemizeValue: "listTotal",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <ListEditorOngoing
            {...{
              menuDisplayNames,
              feId: incomeValue.oneChildFeId("ongoingList"),
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
