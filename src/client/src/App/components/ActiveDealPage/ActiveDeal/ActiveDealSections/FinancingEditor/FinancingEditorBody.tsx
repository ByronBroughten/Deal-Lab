import { Box } from "@mui/material";
import { DealMode } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { getFinancingTitle } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSection } from "../../../../appWide/FormSection";
import MainSectionBody from "../../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { PageTitle } from "../../../../appWide/PageTitle";

interface Props {
  children: React.ReactNode;
  feId: string;
  dealMode: DealMode;
}
export function FinancingEditorBody({ children, feId, dealMode }: Props) {
  const financing = useGetterSection({ sectionName: "financing", feId });
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <PageTitle
          text={getFinancingTitle(
            dealMode,
            financing.valueNext("financingMode")
          )}
        />
      </Box>
      <MainSectionBody>
        <FormSection sx={{ borderTopWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {children}
          </Box>
        </FormSection>
      </MainSectionBody>
    </div>
  );
}
