import React from "react";
import styled from "styled-components";
import theme from "../../../../../theme/Theme";
import { PercentOngoingDollarInput } from "../../general/PercentOngoingDollarInput";

type Props = { feId: string; className?: string };
export function BasicMgmtInfo({ feId, className }: Props) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  return (
    <Styled
      {...{ sectionName: "mgmt", className: `BasicMgmtInfo-root ${className}` }}
    >
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
