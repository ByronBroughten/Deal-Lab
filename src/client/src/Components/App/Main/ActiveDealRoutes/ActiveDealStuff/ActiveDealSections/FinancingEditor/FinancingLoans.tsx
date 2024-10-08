import { Box } from "@mui/material";
import { useAction } from "../../../../../../../modules/stateHooks/useAction";
import { useGetterSection } from "../../../../../../../modules/stateHooks/useGetterSection";
import { FeIdProp } from "../../../../../../../sharedWithServer/StateGetters/Identifiers/NanoIdInfo";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import { SubSectionBtn } from "../../../../../appWide/GeneralSection/GeneralSectionTitle/SubSectionBtn";
import { Loan } from "./Loan";

export function FinancingLoans({ feId }: FeIdProp) {
  const addChild = useAction("addChild");
  const financing = useGetterSection({
    sectionName: "financing",
    feId,
  });

  const addLoan = () =>
    addChild({
      feInfo: financing.feInfo,
      childName: "loan",
    });

  const loanIds = financing.childFeIds("loan");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        paddingTop: nativeTheme.s4,
      }}
    >
      {loanIds.map((feId, idx) => (
        <Loan
          key={feId}
          feId={feId}
          sx={idx !== 0 ? { mt: nativeTheme.s4 } : undefined}
          showXBtn={loanIds.length > 1}
          showTitleAppend={false}
        />
      ))}
      <SubSectionBtn
        sx={{
          fontSize: nativeTheme.chunkTitleFs,
          mt: nativeTheme.s45,
          height: "80px",
        }}
        onClick={addLoan}
        middle="+ Loan"
      />
    </Box>
  );
}
