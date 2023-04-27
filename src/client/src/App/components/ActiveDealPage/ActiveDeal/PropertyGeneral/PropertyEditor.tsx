import { StateValue } from "../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../theme/nativeTheme";
import { FormSectionLabeled } from "../../../appWide/FormSectionLabeled";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";
import { CapExValue } from "./Property/CapExValue";
import { CostOverrunValue } from "./Property/CostOverrunValue";
import { CustomExpenses } from "./Property/CustomExpenses";
import { MaintenanceValue } from "./Property/MaintenanceValue";
import { RepairValue } from "./Property/RepairValue";
import { Units } from "./Property/Units";
import { UtilityValue } from "./Property/UtilityValue";

type Props = {
  feId: string;
  dealMode: StateValue<"dealMode">;
  backBtnProps: {
    backToWhat: string;
    onClick: () => void;
  };
};

function PropertyFixAndFlipEditor() {}
function PropertyBuyAndHoldEditor() {}

export function PropertyEditor({ feId, backBtnProps }: Props) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  const sectionTitle = "Property";
  return (
    <div>
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle,
          showControls: true,
        }}
      />
      <MainSectionBody themeName="property">
        <BasicPropertyInfo feId={feId} className="Property-basicInfo" />
        <Units {...{ feId }} />
        <FormSectionLabeled {...{ label: "Rehab" }}>
          <RepairValue feId={property.onlyChildFeId("repairValue")} />
          <CostOverrunValue
            feId={property.onlyChildFeId("costOverrunValue")}
            sx={{ mt: nativeTheme.s35 }}
          />
        </FormSectionLabeled>
        <UtilityValue feId={property.onlyChildFeId("utilityValue")} />
        <CapExValue feId={property.onlyChildFeId("capExValue")} />
        <MaintenanceValue feId={property.onlyChildFeId("maintenanceValue")} />
        <CustomExpenses {...feInfo} />
      </MainSectionBody>
    </div>
  );
}
