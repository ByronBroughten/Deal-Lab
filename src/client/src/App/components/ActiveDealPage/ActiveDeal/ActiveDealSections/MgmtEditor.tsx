import styled from "styled-components";
import { StateValue } from "../../../../../sharedWithServer/sectionVarbsConfig/StateValue";
import theme from "../../../../theme/Theme";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { BasicMgmtInfo } from "./MgmtEditor/MgmtOngoingCosts";

type Props = {
  feId: string;
  dealMode: StateValue<"dealMode">;
};

export function MgmtEditor({ feId }: Props) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  return (
    <Styled>
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Management",
        }}
      />
      <MainSectionBody themeName="mgmt">
        <BasicMgmtInfo feId={feId} />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled.div`
  .Mgmt-basicInfo,
  .Mgmt-ongoingExpenseValue,
  .Mgmt-oneTimeExpenseValue {
    margin: ${theme.flexElementSpacing};
  }
  .Mgmt-valueSectionZones {
    display: flex;
    margin-top: ${theme.s35};
  }

  .ValueSectionBtn-root {
    width: 150px;
  }
`;
