import { FeIdProp } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import { SelectAndItemizeEditorNext } from "../../../../appWide/SelectAndItemizeEditorNext";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";
import { ListEditorOneTime } from "./ValueShared/ListEditorOneTime";

interface Props extends FeIdProp {
  menuDisplayNames?: string[];
}

export function MiscOnetimeCost({ feId, menuDisplayNames }: Props) {
  const feInfo = { sectionName: "miscOnetimeCost", feId } as const;
  const onetimeCost = useGetterSection(feInfo);

  const valueVarb = onetimeCost.varbNext("valueDollars");
  const sourceName = onetimeCost.valueNext("valueSourceName");
  return (
    <SelectAndItemizeEditorNext
      {...{
        label: "Misc one-time costs",
        itemizedModalTitle: "Misc one-time costs",
        makeEditor:
          sourceName === "dollarsEditor"
            ? (props) => (
                <NumObjEntityEditor
                  {...{
                    ...props,
                    feVarbInfo: {
                      ...feInfo,
                      varbName: "valueDollarsEditor",
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
          ["dollarsEditor", "Amount"],
          ["listTotal", "Itemize"],
        ],
        itemizeValue: "listTotal",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <ListEditorOneTime
            {...{
              menuDisplayNames,
              feId: onetimeCost.oneChildFeId("onetimeList"),
              menuType: "value",
              routeBtnProps: {
                title: "Misc one-time lists",
                routeName: "onetimeListMain",
              },
            }}
          />
        ),
      }}
    />
  );
}
