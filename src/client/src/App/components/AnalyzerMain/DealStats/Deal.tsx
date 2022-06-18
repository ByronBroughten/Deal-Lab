import styled from "styled-components";
import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../theme/Theme";
import MainSection from "../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import DealDetails from "./Deal/DealDetails";
import DealOutputList from "./Deal/DealOutputList";

export function Deal({
  feId,
  detailsIsOpen,
}: {
  feId: string;
  detailsIsOpen: boolean;
}) {
  const deal = useGetterSection({
    sectionName: "deal",
    feId: feId,
  });
  const outputListId = deal.onlyChildFeId("dealOutputList");
  return (
    <MainSection>
      <MainSectionTitleRow
        {...{
          pluralName: "analyses",
          feInfo: deal.feInfo,
        }}
      />
      <MainSectionBody>
        <Styled className="ListGroup-root">
          <div className="Deal-viewable viewable">
            {!detailsIsOpen && <DealOutputList feId={outputListId} />}
            {detailsIsOpen && <DealDetails feId={outputListId} />}
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
