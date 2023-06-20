import { Box } from "@mui/material";
import styled from "styled-components";
import { DealMode } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { getFinancingTitle } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import { FormSection } from "../../../../appWide/FormSection";
import { PageTitle } from "../../../../appWide/PageTitle";

interface Props {
  children: React.ReactNode;
  feId: string;
  dealMode: DealMode;
}
export function FinancingEditorBody({ children, feId, dealMode }: Props) {
  const financing = useGetterSection({ sectionName: "financing", feId });
  return (
    <Styled>
      <div className="Financing-titleRow">
        <PageTitle
          text={getFinancingTitle(
            dealMode,
            financing.valueNext("financingMode")
          )}
        />
      </div>
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
    </Styled>
  );
}

const Styled = styled.div`
  .Financing-inputDiv {
    /* display: flex;
    flex-direction: column;
    flex: 1; */
  }
  .Financing-financingTypeControl {
    .MuiFormLabel-root {
      font-size: ${theme.infoSize};
      color: ${theme.dark};
    }
    .MuiFormControlLabel-label {
      margin-left: ${theme.s25};
    }
    .MuiFormControlLabel-root {
      margin: 0;
      margin-top: ${theme.s15};
    }
    .Mui-checked {
      color: ${theme.primaryNext};
    }
  }
  .Financing-titleRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .Financing-loans {
    margin-top: ${theme.s4};
  }
`;
