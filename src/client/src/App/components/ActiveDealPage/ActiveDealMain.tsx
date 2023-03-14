import { FormControl, MenuItem, Select } from "@material-ui/core";
import styled from "styled-components";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../theme/Theme";
import { FormSection } from "../appWide/FormSection";
import { MainSectionTopRows } from "../appWide/MainSectionTopRows";
import StandardLabel from "../general/StandardLabel";
import { OutputSection } from "./ActiveDeal/DealOutputs/OutputSection";
import { DealSubSectionClosed } from "./ActiveDeal/DealSubSectionClosed";

export function ActiveDealMain() {
  const main = useSetterSectionOnlyOne("main");
  const outputSection = main.get.onlyChild("outputSection");
  const dealPage = main.onlyChild("activeDealPage");
  const deal = dealPage.get.onlyChild("deal");
  const calculatedVarbs = dealPage.onlyChild("calculatedVarbs");

  const completionStatus = calculatedVarbs.value("dealCompletionStatus");

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
          feId={outputSection.onlyChildFeId("buyAndHoldOutputList")}
          disableOpenOutputs={completionStatus !== "allValid"}
          outputsIsOpen={dealPage.value("showOutputs")}
          openOutputs={() =>
            dealPage.updateValues({
              showOutputs: true,
            })
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
