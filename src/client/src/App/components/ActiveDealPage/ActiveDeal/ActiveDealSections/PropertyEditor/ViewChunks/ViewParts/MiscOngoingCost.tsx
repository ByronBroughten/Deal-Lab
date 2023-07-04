import { FeIdProp } from "../../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { ListEditorOngoing } from "../../ValueShared/ListEditorOngoing";

interface Props extends FeIdProp {
  menuDisplayNames: string[];
}
export function MiscOngoingCost({ feId, menuDisplayNames }: Props) {
  const feInfo = { sectionName: "miscOngoingCost", feId } as const;
  const ongoingCost = useGetterSection(feInfo);

  const valueVarb = ongoingCost.switchVarb("valueDollars", "periodic");
  const sourceName = ongoingCost.valueNext("valueSourceName");
  return (
    <SelectAndItemizeEditor
      inputMargins
      {...{
        unionValueName: "dollarsOrListOngoing",
        label: "Misc ongoing costs",
        itemizedModalTitle: "Misc ongoing costs",
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
              feId: ongoingCost.oneChildFeId("periodicList"),
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
