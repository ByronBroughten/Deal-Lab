import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import { FormSection } from "../../../../appWide/FormSection";
import { LabelWithInfo } from "../../../../appWide/LabelWithInfo";
import { PercentOngoingDollarInput } from "../../general/PercentOngoingDollarInput";
import { BasePayValue } from "./MgmtBasePayValue";

type Props = { feId: string; className?: string };
export function BasicMgmtInfo({ feId, className }: Props) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  const mgmt = useGetterSection(feInfo);
  return (
    <Styled
      {...{ sectionName: "mgmt", className: `BasicMgmtInfo-root ${className}` }}
    >
      <BasePayValue {...{ feId: mgmt.onlyChildFeId("mgmtBasePayValue") }} />
      <FormSection>
        <PercentOngoingDollarInput
          {...{
            label: (
              <LabelWithInfo
                {...{
                  label: "Vacancy Loss",
                  infoTitle: "Vacancy Loss",
                  infoText: `No property will be fully occupied 100% of the time. When tenants move out, it can sometimes take days or weeks to prepare their unit for another renter. To account for this, assume you will miss out on a certain portion of the property's rent.\n\nIf you're owner-managing the property and you're determined to keep vacancy low, a common method is to asume you will miss out on 5% of the rent; and if you're using a property manager or management company (who probably won't be quite as motivated as you), something like 10% is common to assume.`,
                }}
              />
            ),
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
