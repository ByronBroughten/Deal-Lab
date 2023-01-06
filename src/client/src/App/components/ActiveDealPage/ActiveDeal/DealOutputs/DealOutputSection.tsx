import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { SectionTitle } from "../../../appWide/SectionTitle";
import { DealDetails } from "./OutputSection/DealDetails";
import { DealOutputList } from "./OutputSection/DealOutputList";

export function OutputSection({
  feId,
  detailsIsOpen,
}: {
  feId: string;
  detailsIsOpen: boolean;
}) {
  const feInfo = { sectionName: "deal", feId } as const;
  const deal = useGetterSection(feInfo);
  const outputListFeId = deal.onlyChild("dealOutputList").feId;
  return (
    <MainSection className="OutputSection-root">
      <SectionTitle text="Outputs" />
      <MainSectionBody themeName="deal">
        <Styled className="ListGroup-root">
          <div className="OutputSection-viewable viewable">
            {!detailsIsOpen && <DealOutputList feId={outputListFeId} />}
            {detailsIsOpen && <DealDetails feId={outputListFeId} />}
          </div>
        </Styled>
      </MainSectionBody>
    </MainSection>
  );
}
const Styled = styled.div`
  border-radius: ${theme.br0};
`;
