import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import { SelectAndItemizeEditorNext } from "../../../../../../appWide/SelectAndItemizeEditorNext";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { ListEditorOngoing } from "../../ValueShared/ListEditorOngoing";

export function MiscHoldingCost({ feId }: { feId: string }) {
  const feInfo = { sectionName: "miscHoldingCost", feId } as const;
  const holdingCost = useGetterSection(feInfo);

  const valueVarb = holdingCost.switchVarb("valueDollars", "ongoing");
  const sourceName = holdingCost.valueNext("valueSourceName");

  const menuDisplayNames = [
    "HOA Fees",
    "Landscaping",
    "Accounting",
    "Legal",
  ] as const;

  return (
    <SelectAndItemizeEditorNext
      {...{
        label: "Misc holding costs",
        itemizedModalTitle: "Misc holding costs",
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
              feId: holdingCost.oneChildFeId("ongoingList"),
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
