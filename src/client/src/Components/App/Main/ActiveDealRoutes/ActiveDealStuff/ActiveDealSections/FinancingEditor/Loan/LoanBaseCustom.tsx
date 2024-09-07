import { SxProps } from "@mui/material";
import { useGetterSection } from "../../../../../../../../stateHooks/useGetterSection";
import { arrSx } from "../../../../../../../../utils/mui";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { ListEditorOneTime } from "../../PropertyEditor/ValueShared/ListEditorOneTime";

type Props = { feId: string; sx?: SxProps };
export function LoanBaseCustom({ feId, sx }: Props) {
  const feInfo = { sectionName: "customLoanBase", feId } as const;
  const customBase = useGetterSection(feInfo);
  const valueSourceName = customBase.valueNext("valueSourceName");
  const valueVarb = customBase.varb("valueDollars");
  return (
    <SelectAndItemizeEditor
      inputMargins
      {...{
        sx: [{ margin: 0, padding: 0 }, ...arrSx(sx)],
        selectProps: { sx: { minWidth: 170 } },
        unionValueName: "dollarsOrList",
        label: "Custom loan",
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        ...(valueSourceName === "valueDollarsEditor" && {
          makeEditor: (props) => (
            <NumObjEntityEditor
              {...props}
              feVarbInfo={customBase.varbInfo2("valueDollarsEditor")}
              labelProps={{ showLabel: false }}
            />
          ),
        }),
        items: [
          ["valueDollarsEditor", "Custom amount"],
          ["listTotal", "Itemize"],
        ],
        itemizedModalTitle: "Wrapped in loan",
        itemizeValue: "listTotal",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <ListEditorOneTime
            {...{
              feId: customBase.oneChildFeId("onetimeList"),
              menuType: "value",
              routeBtnProps: {
                title: "Onetime Lists",
                routeName: "onetimeListMain",
              },
              menuDisplayNames: ["Purchase price", "Repairs", "Closing costs"], // could change based on financing mode
            }}
          />
        ),
      }}
    />
  );
}
