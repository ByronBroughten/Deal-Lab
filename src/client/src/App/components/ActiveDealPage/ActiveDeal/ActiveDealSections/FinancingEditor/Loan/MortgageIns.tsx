import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { ToggledNode } from "../../../../../appWide/ToggledNode";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";

interface Props {
  feId: string;
}
export function MortgageIns({ feId }: Props) {
  const loan = useGetterSection({ sectionName: "loan", feId });
  return (
    <ToggledNode
      {...{
        feVarbInfo: loan.varbInfo("hasMortgageIns"),
        toggledNode: (
          <MuiRow
            sx={{
              "& .MuiInputBase-root": {
                minWidth: "135px",
              },
            }}
          >
            <NumObjEntityEditor
              sx={{
                marginRight: nativeTheme.s3,
              }}
              feVarbInfo={loan.varbInfo("mortgageInsUpfrontEditor")}
              label="Upfront"
            />
            <NumObjEntityEditor
              feVarbInfo={loan.varbInfo("mortgageInsPeriodicEditor")}
              label="Ongoing"
            />
          </MuiRow>
        ),
      }}
    />
  );
}
