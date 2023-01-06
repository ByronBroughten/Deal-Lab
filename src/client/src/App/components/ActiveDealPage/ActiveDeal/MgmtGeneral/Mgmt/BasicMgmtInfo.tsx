import React from "react";
import styled from "styled-components";
import { switchNames } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsVarbs/RelSwitchVarb";
import theme from "../../../../../theme/Theme";
import { useOpenWidth } from "../../../../appWide/customHooks/useOpenWidth";
import BasicSectionInfo from "../../../../appWide/GeneralSection/MainSection/MainSectionBody/BasicSectionInfo";
import { DollarPercentRadioSwap } from "../../general/DollarPercentRadioSwap";
import VacancyRate from "./BasicMgmtInfo/VacancyRate";

type Props = { feId: string; className?: string };
export default function BasicMgmtInfo({ feId, className }: Props) {
  const feInfo = {
    sectionName: "mgmt",
    feId,
  } as const;

  const { trackWidthToggleView, ...titleRowProps } = useOpenWidth();
  const { viewIsOpen } = titleRowProps;

  const rentCut = switchNames("rentCut", "dollarsPercent");
  const rentCutDollars = switchNames(rentCut.dollars, "ongoing");
  return (
    <Styled
      {...{ sectionName: "mgmt", className: `BasicMgmtInfo-root ${className}` }}
    >
      {viewIsOpen && (
        <div>
          <DollarPercentRadioSwap
            {...{
              className: "BasicMgmtInfo-radioSwap",
              names: {
                switch: rentCut.switch,
                percent: rentCut.percent,
                dollars: rentCutDollars.monthly,
                dollarsEditor: "rentCutDollarsEditor",
                percentEditor: "rentCutPercentEditor",
              },
              feInfo,
              title: "Cut of rent",
            }}
          />
          <VacancyRate feId={feId} />
        </div>
      )}
    </Styled>
  );
}

const Styled = styled(BasicSectionInfo)`
  .BasicMgmtInfo-radioSwap {
    .MuiInputBase-root {
      min-width: 85px;
    }
  }
  .VacancyRate-root {
    margin-top: ${theme.s3};
    .MuiInputBase-root {
      min-width: 123px;
    }
  }
`;
