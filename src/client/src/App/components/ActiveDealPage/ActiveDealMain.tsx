import { FormControl, MenuItem, Select } from "@material-ui/core";
import styled from "styled-components";
import { CompletionStatus } from "../../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../theme/Theme";
import { FormSection } from "../appWide/FormSection";
import { MainSectionTopRows } from "../appWide/MainSectionTopRows";
import StandardLabel from "../general/StandardLabel";
import { OutputSection } from "./ActiveDeal/DealOutputs/OutputSection";
import { DealSubSectionClosed } from "./ActiveDeal/DealSubSectionClosed";

export function ActiveDealMain() {
  const dealPage = useGetterSectionOnlyOne("dealPage");
  const deal = dealPage.onlyChild("deal");
  const calculatedVarbs = dealPage.onlyChild("calculatedVarbs");
  return (
    <Styled className={`ActiveDealMain-root`}>
      <MainSectionTopRows
        {...{
          ...deal.feInfo,
          className: "ActiveDeal-mainSectionTopRowRoot",
          sectionTitle: "Deal",
          loadWhat: "Deal",
        }}
      />
      <FormSection className="ActiveDeal-modeSelectorSection">
        <FormControl className="ActiveDeal-modeSelectorControl" size={"small"}>
          <StandardLabel className="ActiveDeal-dealModeLabel">
            Mode
          </StandardLabel>
          <Select
            className="ActiveDeal-modeSelector"
            labelId="ActiveDeal-modeSelector"
            id="demo-simple-select"
            value={"buyAndHold"}
            label="Age"
            onChange={() => {}}
          >
            <MenuItem value={"buyAndHold"}>Buy & Hold</MenuItem>
            <MenuItem value={"moreToCome"}>More to Come...</MenuItem>
          </Select>
        </FormControl>
      </FormSection>
      <FormSection className="ActiveDeal-mainFormSection">
        <div className="ActiveDeal-inputSectionsWrapper">
          <DealSubSectionClosed sectionName="property" />
          <DealSubSectionClosed sectionName="financing" />
          <DealSubSectionClosed sectionName="mgmt" />
        </div>
      </FormSection>
      {
        <OutputSection
          feId={deal.onlyChildFeId("dealOutputList")}
          completionStatus={
            calculatedVarbs.valueNext(
              "dealCompletionStatus"
            ) as CompletionStatus
          }
        />
      }
    </Styled>
  );
}

const Styled = styled.div`
  .ActiveDeal-modeSelector {
    margin-top: 0px;
  }

  .ActiveDeal-mainFormSection {
    padding: 0px;
  }

  .MainSubSectionClosed-root {
    margin-top: ${theme.dealElementSpacing};
  }

  .ActiveDeal-inputSectionsWrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .OutputSection-root {
    margin-top: ${theme.dealElementSpacing};
    position: sticky;
    bottom: 0;
    z-index: 3;
  }
`;
