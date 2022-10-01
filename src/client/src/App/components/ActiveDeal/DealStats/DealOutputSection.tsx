import styled from "styled-components";
import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
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
  const deal = useGetterSection({
    sectionName: "deal",
    feId: feId,
  });
  const outputListFeId = deal.onlyChild("dealOutputList").feId;
  return (
    <MainSection>
      <MainSectionTitleRow
        {...{
          ...deal.feInfo,
          pluralName: "deals",
          dropTop: true,
        }}
      />
      <MainSectionBody themeName="deal">
        <Styled className="ListGroup-root">
          <div className="DealOutputSection-viewable viewable">
            {!detailsIsOpen && <DealOutputList feId={outputListFeId} />}
            {detailsIsOpen && <DealDetails feId={outputListFeId} />}
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
