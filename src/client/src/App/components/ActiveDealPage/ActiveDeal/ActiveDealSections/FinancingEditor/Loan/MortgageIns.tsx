import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { ToggledNode } from "../../../../../appWide/ToggledNode";
import { MuiRow } from "../../../../../general/MuiRow";
import { MortgageInsPeriodicValue } from "./MortgageInsPeriodicValue";
import { MortgageInsUpfrontValue } from "./MortgageInsUpfrontValue";

interface Props {
  feId: string;
  editorMargins?: boolean;
}
export function MortgageIns({ feId, editorMargins }: Props) {
  const loan = useGetterSection({ sectionName: "loan", feId });
  const mortIns = loan.onlyChild("mortgageInsPeriodicValue");
  const switchValue = mortIns.switchValue("percentLoan", "periodic");

  const varbNames = {
    monthly: "mortgageInsMonthly",
    yearly: "mortgageInsYearly",
  } as const;
  const displayVarbName = varbNames[switchValue];
  return (
    <ToggledNode
      {...{
        editorMargins,
        feVarbInfo: loan.varbInfo("hasMortgageIns"),
        toggledNode: (
          <MuiRow
            sx={{
              "& .MuiInputBase-root": {
                minWidth: "135px",
              },
            }}
          >
            <MortgageInsUpfrontValue
              {...{
                sx: { marginRight: nativeTheme.s3 },
                feId: loan.oneChildFeId("mortgageInsUpfrontValue"),
                totalDisplayVarb: loan.displayVarb("mortgageInsUpfront"),
              }}
            />
            <MortgageInsPeriodicValue
              {...{
                feId: loan.oneChildFeId("mortgageInsPeriodicValue"),
                percentDisplayVarb: loan.displayVarb(displayVarbName),
              }}
            />
          </MuiRow>
        ),
      }}
    />
  );
}
