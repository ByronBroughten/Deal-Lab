import { SxProps } from "@mui/material";
import { useGetterSection } from "../../../../../../../../stateHooks/useGetterSection";
import { arrSx } from "../../../../../../../../utils/mui";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { ToggledNode } from "../../../../../../appWide/ToggledNode";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { ListEditorOneTime } from "../../PropertyEditor/ValueShared/ListEditorOneTime";

type Props = { feId: string; sx?: SxProps; editorMargins?: boolean };
export function LoanBaseExtra({ feId, sx, editorMargins }: Props) {
  const feInfo = { sectionName: "loanBaseExtra", feId } as const;
  const loanExtra = useGetterSection(feInfo);
  const valueSourceName = loanExtra.valueNext("valueSourceName");
  const valueVarb = loanExtra.varb("valueDollars");
  return (
    <ToggledNode
      editorMargins={editorMargins}
      feVarbInfo={loanExtra.varbInfo("hasLoanExtra")}
      toggledNode={
        <SelectAndItemizeEditor
          inputMargins
          {...{
            sx: [{ margin: 0, padding: 0 }, ...arrSx(sx)],
            selectProps: { sx: { minWidth: 125 } },
            unionValueName: "dollarsListOrZero",
            feVarbInfo: {
              ...feInfo,
              varbName: "valueSourceName",
            },
            ...(valueSourceName === "valueDollarsEditor" && {
              makeEditor: (props) => (
                <NumObjEntityEditor
                  {...props}
                  labelProps={{ showLabel: false }}
                  feVarbInfo={loanExtra.varbInfo2("valueDollarsEditor")}
                />
              ),
            }),
            items: [
              ["valueDollarsEditor", "Custom amount"],
              ["listTotal", "Itemize"],
            ],
            itemizedModalTitle: "Extra Expenses Covered By Loan",
            itemizeValue: "listTotal",
            total: valueVarb.displayVarb(),
            itemsComponent: (
              <ListEditorOneTime
                {...{
                  feId: loanExtra.oneChildFeId("onetimeList"),
                  menuType: "value",
                  routeBtnProps: {
                    title: "Onetime Lists",
                    routeName: "onetimeListMain",
                  },
                  menuDisplayNames: [
                    "Purchase price",
                    "Repairs",
                    "Closing costs",
                  ], // could change based on financing mode
                }}
              />
            ),
          }}
        />
      }
    />
  );
}
