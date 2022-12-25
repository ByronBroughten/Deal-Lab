import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../theme/Theme";
import { MainSectionTitleRow } from "../appWide/GeneralSection/MainSection/MainSectionTitleRow";
import { MainSectionTitleEditor } from "../appWide/GeneralSection/MainSection/MainSectionTitleRow/MainSectionTitleEditor";
import { OuterMainSection } from "./../appWide/GeneralSection/OuterMainSection";
import { DealGeneral } from "./ActiveDeal/DealGeneral";
import Financing from "./ActiveDeal/Financing";
import { MgmtGeneral } from "./ActiveDeal/MgmtGeneral";
import { PropertyGeneral } from "./ActiveDeal/PropertyGeneral";

type Props = {
  feId: string;
  loginSuccess?: boolean;
  className?: string;
};
export function ActiveDeal({ className, feId }: Props) {
  const feInfo = { sectionName: "deal", feId } as const;
  const deal = useGetterSection(feInfo);
  return (
    <Styled className={`ActiveDeal-root ${className ?? ""}`}>
      <MainSectionTitleRow
        {...{
          ...feInfo,
          sectionTitle: "Deal",
          pluralName: "deals",
          className: "ActiveDeal-mainSectionTitleRow",
        }}
      />
      <MainSectionTitleEditor
        className="ActiveDeal-mainSectionTitleEditor"
        feInfo={feInfo}
      />
      <div className="ActiveDeal-inputSectionsWrapper">
        <PropertyGeneral feId={deal.onlyChildFeId("propertyGeneral")} />
        <MgmtGeneral feId={deal.onlyChildFeId("mgmtGeneral")} />
        <Financing feId={deal.onlyChildFeId("financing")} />
      </div>
      <DealGeneral feId={feId} />
    </Styled>
  );
}

const Styled = styled(OuterMainSection)`
  .PropertyGeneral-root {
    padding-top: ${theme.s4};
  }

  .ActiveDeal-mainSectionTitleEditor {
    margin-left: ${theme.s3};
    margin-top: ${theme.s3};
  }

  .ActiveDeal-mainSectionTitleRow {
    margin-left: ${theme.s3};
    .SectionTitleRow-sectionTitle {
      font-size: 22px;
    }
  }
  .ActiveDeal-inputSectionsWrapper {
    margin: auto;
  }
  .DealGeneral-root {
    position: sticky;
    bottom: 0;
    z-index: 3;
  }
`;
