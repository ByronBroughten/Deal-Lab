import { Box } from "@mui/material";
import { useGetterSection } from "../../../../../../../modules/stateHooks/useGetterSection";
import { DealMode } from "../../../../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/dealMode";
import { getFinancingTitle } from "../../../../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/unionValues";
import { FormSection } from "../../../../../appWide/FormSection";
import MainSectionBody from "../../../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { PageTitle } from "../../../../../appWide/PageTitle";
import { useIsDevices } from "../../../../../customHooks/useMediaQueries";

interface Props {
  children: React.ReactNode;
  feId: string;
  dealMode: DealMode;
}
export function FinancingEditorBody({ children, feId, dealMode }: Props) {
  const financing = useGetterSection({ sectionName: "financing", feId });
  const { isPhone } = useIsDevices();
  return (
    <Box
      sx={{
        ...(!isPhone && { minWidth: 500 }),
      }}
    >
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
    </Box>
  );
}
