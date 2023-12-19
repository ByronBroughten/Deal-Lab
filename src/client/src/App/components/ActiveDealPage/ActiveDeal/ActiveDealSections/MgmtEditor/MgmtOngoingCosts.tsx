import { useGetterSection } from "../../../../../stateClassHooks/useGetterSection";
import { FormSectionNext } from "../../../../appWide/FormSectionNext";
import { MuiRow } from "../../../../general/MuiRow";
import { MiscOnetimeValue } from "../PropertyEditor/ViewChunks/ViewParts/MiscOnetimeValue";
import { MiscOngoingCost } from "../PropertyEditor/ViewChunks/ViewParts/MiscOngoingCost";
import { BasePayValue } from "./MgmtOngoingCosts/MgmtBasePayValue";
import { VacancyLossValue } from "./VacancyLossValue";

type Props = { feId: string };
export function BasicMgmtInfo({ feId }: Props) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  const mgmt = useGetterSection(feInfo);
  return (
    <FormSectionNext>
      <MuiRow>
        <BasePayValue {...{ feId: mgmt.onlyChildFeId("mgmtBasePayValue") }} />
        <VacancyLossValue
          {...{ feId: mgmt.onlyChildFeId("vacancyLossValue") }}
        />
        <MiscOnetimeValue feId={mgmt.onlyChildFeId("miscOnetimeCost")} />
        <MiscOngoingCost
          feId={mgmt.onlyChildFeId("miscOngoingCost")}
          menuDisplayNames={["Advertising", "Unit turnover", "Maintenance"]}
        />
      </MuiRow>
    </FormSectionNext>
  );
}
