import styled from "styled-components";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import { BasePayValue } from "./MgmtBasePayValue";
import { VacancyLossValue } from "./VacancyLossValue";

type Props = { feId: string; className?: string };
export function BasicMgmtInfo({ feId, className }: Props) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  const mgmt = useGetterSection(feInfo);
  return (
    <Styled
      {...{ sectionName: "mgmt", className: `BasicMgmtInfo-root ${className}` }}
    >
      <BasePayValue {...{ feId: mgmt.onlyChildFeId("mgmtBasePayValue") }} />
      <VacancyLossValue {...{ feId: mgmt.onlyChildFeId("vacancyLossValue") }} />
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
