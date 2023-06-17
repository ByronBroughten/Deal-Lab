import { SxProps } from "@mui/material";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { arrSx } from "../../../../../../utils/mui";
import { SelectAndItemizeEditor } from "../../../../../appWide/SelectAndItemizeEditor";
import { ToggledNode } from "../../../../../appWide/ToggledNode";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { ListEditorOneTime } from "../../PropertyEditor/ValueShared/ListEditorOneTime";

type Props = { feId: string; sx?: SxProps };
export function LoanBaseExtra({ feId, sx }: Props) {
  const feInfo = { sectionName: "loanBaseExtra", feId } as const;
  const loanExtra = useGetterSection(feInfo);
  const valueSourceName = loanExtra.valueNext("valueSourceName");
  const valueVarb = loanExtra.varb("valueDollars");
  return (
    <ToggledNode
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
                  feVarbInfo={loanExtra.varbInfo("valueDollarsEditor")}
                />
              ),
            }),
            ...(valueSourceName === "zero" && { equalsValue: "$0" }),
            items: [
              // ["zero", "None"],
              ["valueDollarsEditor", "Amount"],
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
