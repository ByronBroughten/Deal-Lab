import React from "react";
import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { MainSection } from "../../../appWide/GeneralSection/MainSection";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { ValueSectionZone } from "../../../appWide/ValueSectionZone";
import BasicMgmtInfo from "./Mgmt/BasicMgmtInfo";

export function Mgmt({ feId }: { feId: string }) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  return (
    <Styled className="Mgmt-root">
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Mgmt",
          loadWhat: "Management",
        }}
      />
      <MainSectionBody themeName="mgmt">
        <BasicMgmtInfo feId={feId} className="Mgmt-basicInfo" />
        <ValueSectionZone
          {...{
            className: "Mgmt-ongoingExpenseValue",
            ...feInfo,
            childName: "ongoingExpenseValue",
            displayName: "Other Ongoing Expenses",
            plusBtnText: "+ Other Ongoing Expenses",
          }}
        />
        <ValueSectionZone
          {...{
            ...feInfo,
            className: "Mgmt-oneTimeExpenseValue",
            childName: "upfrontExpenseValue",
            displayName: "One-Time Expenses",
            plusBtnText: "+ One-Time Expenses",
          }}
        />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(MainSection)`
  .Mgmt-basicInfo,
  .Mgmt-ongoingExpenseValue,
  .Mgmt-oneTimeExpenseValue {
    margin: ${theme.flexElementSpacing};
  }
  :hover {
    .MainSectionTitleRow-xBtn {
      visibility: visible;
    }
  }

  .ValueSectionBtn-root {
    width: 150px;
  }
`;
