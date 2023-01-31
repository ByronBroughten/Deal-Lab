import React from "react";
import styled from "styled-components";
import theme from "../../../../../theme/Theme";
import { FormSection } from "../../../../appWide/FormSection";
import { PercentOngoingDollarInput } from "../../general/PercentOngoingDollarInput";

type Props = { feId: string; className?: string };
export function BasicMgmtInfo({ feId, className }: Props) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  return (
    <Styled
      {...{ sectionName: "mgmt", className: `BasicMgmtInfo-root ${className}` }}
    >
      <FormSection>
        <PercentOngoingDollarInput
          {...{
            label: "Base Pay",
            percentOfWhat: "gross rent",
            unitBaseName: "basePay",
            ongoingBaseName: "basePayDollars",
            className: "BasicMgmtInfo-basePay",
            ...feInfo,
          }}
        />
      </FormSection>
      <FormSection>
        <PercentOngoingDollarInput
          {...{
            label: "Vacancy Loss",
            percentOfWhat: "gross rent",
            unitBaseName: "vacancyLoss",
            ongoingBaseName: "vacancyLossDollars",
            className: "BasicMgmtInfo-vacancyLoss",
            ...feInfo,
          }}
        />
      </FormSection>
    </Styled>
  );
}

const Styled = styled.div`
  .BasicMgmtInfo-basePay {
  }
  .BasicMgmtInfo-vacancyLoss {
    margin-top: ${theme.s25};
  }
`;
