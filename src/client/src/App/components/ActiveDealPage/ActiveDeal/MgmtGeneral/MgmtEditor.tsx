import styled from "styled-components";
import { StateValue } from "../../../../sharedWithServer/SectionsMeta/values/StateValue";
import theme from "../../../../theme/Theme";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { CustomExpenses } from "../PropertyGeneral/Property/CustomExpenses";
import { BasicMgmtInfo } from "./Mgmt/BasicMgmtInfo";

type Props = {
  feId: string;
  dealMode: StateValue<"dealMode">;
  backBtnProps: {
    backToWhat: string;
    onClick: () => void;
  };
};

export function MgmtEditor({ feId, backBtnProps }: Props) {
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
        <BasicMgmtInfo feId={feId} className="Mgmt-basicInfo" />
        <CustomExpenses {...feInfo} />
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
