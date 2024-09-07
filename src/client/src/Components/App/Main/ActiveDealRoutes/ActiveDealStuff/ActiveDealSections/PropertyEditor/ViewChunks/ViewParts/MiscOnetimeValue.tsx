import { FeIdProp } from "../../../../../../../../../sharedWithServer/StateGetters/Identifiers/NanoIdInfo";
import { useGetterSection } from "../../../../../../../../../stateHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../../../theme/nativeTheme";
import { SelectAndItemizeEditor } from "../../../../../../../appWide/SelectAndItemizeEditor";
import { NumObjEntityEditor } from "../../../../../../../inputs/NumObjEntityEditor";
import { ListEditorOneTime } from "../../ValueShared/ListEditorOneTime";

interface Props extends FeIdProp {
  menuDisplayNames?: string[];
}

export function MiscOnetimeValue({ feId, menuDisplayNames }: Props) {
  const feInfo = { sectionName: "miscOnetimeValue", feId } as const;
  const onetimeCost = useGetterSection(feInfo);

  const valueVarb = onetimeCost.varbNext("valueDollars");
  const sourceName = onetimeCost.valueNext("valueSourceName");
  return (
    <SelectAndItemizeEditor
      inputMargins
      {...{
        label: "Misc upfront costs",
        itemizedModalTitle: "Misc upfront costs",
        makeEditor:
          sourceName === "valueDollarsEditor"
            ? (props) => (
                <NumObjEntityEditor
                  {...{
                    ...props,
                    labelProps: { showLabel: false },
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
          ["valueDollarsEditor", "Custom amount"],
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
                title: "Misc onetime lists",
                routeName: "onetimeListMain",
              },
            }}
          />
        ),
      }}
    />
  );
}
