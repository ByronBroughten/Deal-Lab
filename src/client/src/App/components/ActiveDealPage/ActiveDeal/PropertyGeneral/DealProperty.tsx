import styled from "styled-components";
import { constants } from "../../../../Constants";
import {
  CompletionStatus,
  DealMode,
} from "../../../../sharedWithServer/SectionsMeta/values/StateValue/subStringValues";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { BackToSectionBtn } from "../BackToSectionBtn";
import { DealSubSectionOpen } from "../DealSubSectionOpen";
import { DomLink } from "../general/DomLink";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";
import { CapExValue } from "./Property/CapExValue";
import { CustomExpenses } from "./Property/CustomExpenses";
import { MaintenanceValue } from "./Property/MaintenanceValue";
import { RepairValue } from "./Property/RepairValue";
import { Units } from "./Property/Units";
import { UtilityValue } from "./Property/UtilityValue";

type Props = {
  feId: string;
  dealMode: DealMode;
  completionStatus: CompletionStatus;
};

export function DealProperty({ feId, completionStatus, dealMode }: Props) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  const isComplete = completionStatus === "allValid";
  const sectionTitle = "Property";
  return (
    <Styled {...{ finishIsAllowed: isComplete }}>
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle,
          loadWhat: sectionTitle,
          showControls: true,
          topRight: (
            <DomLink to={constants.feRoutes.activeDeal}>
              <BackToSectionBtn backToWhat="Deal" />
            </DomLink>
          ),
        }}
      />
      <MainSectionBody themeName="property">
        <BasicPropertyInfo feId={feId} className="Property-basicInfo" />
        <Units {...{ feId }} />
        <RepairValue feId={property.onlyChildFeId("repairValue")} />
        <UtilityValue feId={property.onlyChildFeId("utilityValue")} />
        <CapExValue feId={property.onlyChildFeId("capExValue")} />
        <MaintenanceValue feId={property.onlyChildFeId("maintenanceValue")} />
        <CustomExpenses {...feInfo} />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(DealSubSectionOpen)`
  .Property-upfrontCostsGroup,
  .Property-ongoingCostGroup {
    padding-top: ${theme.s3};
  }
`;
