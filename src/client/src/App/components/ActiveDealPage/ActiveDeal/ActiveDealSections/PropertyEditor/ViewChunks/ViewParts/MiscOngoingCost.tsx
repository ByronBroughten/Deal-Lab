import { FeIdProp } from "../../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import { SelectAndItemizeEditorNext } from "../../../../../../appWide/SelectAndItemizeEditorNext";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { ListEditorOngoing } from "../../ValueShared/ListEditorOngoing";

interface Props extends FeIdProp {
  menuDisplayNames: string[];
}
export function MiscOngoingCost({ feId, menuDisplayNames }: Props) {
  const feInfo = { sectionName: "miscOngoingCost", feId } as const;
  const ongoingCost = useGetterSection(feInfo);

  const valueVarb = ongoingCost.switchVarb("valueDollars", "ongoing");
  const sourceName = ongoingCost.valueNext("valueSourceName");
  return (
    <SelectAndItemizeEditorNext
      {...{
        label: "Misc ongoing costs",
        itemizedModalTitle: "Misc ongoing costs",
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
              feId: ongoingCost.oneChildFeId("ongoingList"),
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
