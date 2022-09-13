import styled from "styled-components";
import theme from "../../../theme/Theme";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import DealDetails from "./DealOutputSection/DealDetails";
import DealOutputList from "./DealOutputSection/DealOutputList";

export function DealOutputSection({
  feId,
  detailsIsOpen,
}: {
  feId: string;
  detailsIsOpen: boolean;
}) {
  return (
    <MainSection>
      <MainSectionTitleRow
        {...{
          ...deal.feInfo,
          pluralName: "Deals",
          dropTop: true,
        }}
      />
      <MainSectionBody themeName="deal">
        <Styled className="ListGroup-root">
          <div className="DealOutputSection-viewable viewable">
            {!detailsIsOpen && <DealOutputList feId={feId} />}
            {detailsIsOpen && <DealDetails feId={feId} />}
          </div>
        </Styled>
      </MainSectionBody>
    </MainSection>
  );
}
const Styled = styled.div`
  background: ${theme.deal.main};
  border: solid 1px ${theme.deal.border};
  border-radius: ${theme.s1};
  box-shadow: ${theme.boxShadow1};
  .MainSection-entry {
    padding-bottom: ${theme.s2};
  }
`;
