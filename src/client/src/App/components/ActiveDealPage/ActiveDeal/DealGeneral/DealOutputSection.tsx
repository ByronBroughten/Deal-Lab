import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTitleRow } from "../../../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import DealDetails from "./DealOutputSection/DealDetails";
import DealOutputList from "./DealOutputSection/DealOutputList";

export function DealOutputSection({
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
    <MainSection>
      <MainSectionTitleRow
        {...{
          ...feInfo,
          sectionTitle: "Outputs",
          pluralName: "outputs",
          showSectionMenus: false,
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
  border-radius: ${theme.br0};
`;
