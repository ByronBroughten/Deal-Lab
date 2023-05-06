import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../appWide/FormSectionLabeled";
import { BasicInfoEditorRow } from "../PropertyEditor/BasicInfoEditorRow";
import { MiscOnetimeCost } from "../PropertyEditor/MiscOnetimeCost";
import { MiscOngoingCost } from "../PropertyEditor/MiscOngoingCost";
import { BasePayValue } from "./MgmtOngoingCosts/MgmtBasePayValue";
import { VacancyLossValue } from "./VacancyLossValue";

type Props = { feId: string };
export function BasicMgmtInfo({ feId }: Props) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  const mgmt = useGetterSection(feInfo);
  return (
    <FormSectionLabeled label={"Basics"}>
      <BasicInfoEditorRow>
        <BasePayValue {...{ feId: mgmt.onlyChildFeId("mgmtBasePayValue") }} />
        <VacancyLossValue
          {...{ feId: mgmt.onlyChildFeId("vacancyLossValue") }}
        />
        <MiscOngoingCost
          feId={mgmt.onlyChildFeId("miscOngoingCost")}
          menuDisplayNames={["Advertising", "Unit turnover", "Maintenance"]}
        />
        <MiscOnetimeCost feId={mgmt.onlyChildFeId("miscOnetimeCost")} />
      </BasicInfoEditorRow>
    </FormSectionLabeled>
  );
}
