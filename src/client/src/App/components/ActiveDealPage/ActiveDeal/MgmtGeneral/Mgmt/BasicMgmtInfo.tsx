import React from "react";
import styled from "styled-components";
import { SwitchTargetKey } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsVarbs/baseSwitchNames";
import { switchNames } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsVarbs/RelSwitchVarb";
import theme from "../../../../../theme/Theme";
import { DollarPercentInput } from "../../general/DollarPercentInput";

function getEditorVarbName(unitSwitch: SwitchTargetKey<"dollarsPercent">) {
  switch (unitSwitch) {
    case "percent":
      return "basePayPercentEditor";
    case "dollars":
      return "basePayDollarsEditor";
    default:
      throw new Error("unitSwitch should be percent or dollars");
  }
}

function getDisplayVarbName(
  unitSwitch: SwitchTargetKey<"dollarsPercent">,
  ongoingSwitch: SwitchTargetKey<"ongoing">
) {
  switch (unitSwitch) {
    case "percent":
      return switchNames("basePayDollars", "ongoing")[ongoingSwitch];
    case "dollars":
      return "basePayPercent";
    default:
      throw new Error("unitSwitch should be percent or dollars");
  }
}

type Props = { feId: string; className?: string };
export function BasicMgmtInfo({ feId, className }: Props) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  return (
    <Styled
      {...{ sectionName: "mgmt", className: `BasicMgmtInfo-root ${className}` }}
    >
      <DollarPercentInput
        {...{
          label: "Base Pay",
          percentOfWhat: "gross rent",
          unitBaseName: "basePay",
          ongoingBaseName: "basePayDollars",
          className: "BasicMgmtInfo-basePay",
          ...feInfo,
        }}
      />
      <DollarPercentInput
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
  flex-direction: column;
  .BasicMgmtInfo-basePay {
  }
  .BasicMgmtInfo-vacancyLoss {
    margin-top: ${theme.s25};
  }
`;
