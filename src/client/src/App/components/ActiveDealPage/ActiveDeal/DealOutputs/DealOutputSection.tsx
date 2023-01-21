import styled, { css } from "styled-components";
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
  hide,
}: {
  feId: string;
  detailsIsOpen: boolean;
  hide?: boolean;
}) {
  const feInfo = { sectionName: "deal", feId } as const;
  const deal = useGetterSection(feInfo);
  const outputListFeId = deal.onlyChild("dealOutputList").feId;
  return (
    <Styled className="OutputSection-root" $hide={hide}>
      <SectionTitle text="Outputs" />
      <MainSectionBody themeName="deal">
        <div className="ListGroup-root">
          <div className="OutputSection-viewable viewable">
            {!detailsIsOpen && <DealOutputList feId={outputListFeId} />}
            {detailsIsOpen && <DealDetails feId={outputListFeId} />}
          </div>
        </div>
      </MainSectionBody>
    </Styled>
  );
}
const Styled = styled(MainSection)<{ $hide?: boolean }>`
  .DealOutputList-root {
    margin-left: -${theme.s2};
  }
  ${({ $hide }) =>
    $hide &&
    css`
      display: none;
    `}
`;
