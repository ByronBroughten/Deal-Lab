import React from "react";
import { StateValue } from "../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../theme/nativeTheme";
import { FormSectionLabeled } from "../../../appWide/FormSectionLabeled";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { LabelWithInfo } from "../../../appWide/LabelWithInfo";
import { ChildValuesOngoing } from "../../../appWide/ListGroup/ListGroupShared/ChildValuesOngoing";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { SectionToggler } from "../../../appWide/SectionToggler";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";
import { BasicBuyAndHoldInfo } from "./PropertyEditor/BasicBuyAndHoldInfo";
import { BasicFixAndFlipInfo } from "./PropertyEditor/BasicFixAndFlipInfo";
import { BasicInfoEditorRow } from "./PropertyEditor/BasicInfoEditorRow";
import { CapExValue } from "./PropertyEditor/CapExValue";
import { CustomExpenses } from "./PropertyEditor/CustomExpenses";
import { MaintenanceValue } from "./PropertyEditor/MaintenanceValue";
import { RehabSection } from "./PropertyEditor/RehabSection";
import { Units } from "./PropertyEditor/Units";
import { UtilityValue } from "./PropertyEditor/UtilityValue";
import { UtilityValueNext } from "./PropertyEditor/UtilityValueNext";

type FeIdProp = { feId: string };

const propertiesByType: Record<
  StateValue<"dealMode">,
  (props: FeIdProp) => React.ReactElement
> = {
  buyAndHold: (props) => <PropertyBuyAndHoldEditor {...props} />,
  fixAndFlip: (props) => <PropertyFixAndFlipEditor {...props} />,
};

export function PropertyEditor({ feId }: FeIdProp) {
  const property = useGetterSection({ sectionName: "property", feId });
  const mode = property.valueNext("propertyMode");
  return propertiesByType[mode]({ feId });
}

function PropertyFixAndFlipEditor({ feId }: { feId: string }) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  return (
    <PropertyEditorBody
      {...{ feId, sectionTitle: "Property", titleAppend: "Fix & Flip" }}
    >
      <BasicFixAndFlipInfo {...{ feId }} />
      <FormSectionLabeled label="Holding Costs">
        <BasicInfoEditorRow>
          <NumObjEntityEditor
            label={
              <LabelWithInfo
                {...{
                  label: "Holding period",
                  infoTitle: "Holding Period",
                  infoText: `This is the amount of time that a property is owned before its rehab is complete and it is either sold (in the case of fix and flip) or refinanced and rented out (in the case of brrrr).\n\nTypically, the longer the holding period, the more that costs will accumulate.`,
                }}
              />
            }
            feVarbInfo={property.varbInfo("holdingPeriodSpanEditor")}
          />
          <NumObjEntityEditor
            feVarbInfo={property.varbInfo("taxesOngoingEditor")}
          />
          <NumObjEntityEditor
            editorType="equation"
            feVarbInfo={property.varbInfo("homeInsOngoingEditor")}
            quickViewVarbNames={["purchasePrice", "sqft", "numUnits"]}
          />
          <UtilityValueNext feId={property.onlyChildFeId("utilityValue")} />
        </BasicInfoEditorRow>
        <SectionToggler
          {...{
            sx: { mt: nativeTheme.s3 },
            labelProps: { sx: { fontSize: nativeTheme.fs17 } },
            labelText: "Custom holding costs",
            feVarbInfo: property.varbInfoNext("useCustomOngoingCosts"),
          }}
        >
          <ChildValuesOngoing {...feInfo} />
        </SectionToggler>
      </FormSectionLabeled>
      <RehabSection {...{ feId, dealMode: "fixAndFlip" }} />
    </PropertyEditorBody>
  );
}
function PropertyBuyAndHoldEditor({ feId }: { feId: string }) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  return (
    <PropertyEditorBody
      {...{ feId, sectionTitle: "Property", titleAppend: "Rental Property" }}
    >
      <BasicBuyAndHoldInfo feId={feId} />
      <Units {...{ feId }} />
      <RehabSection {...{ feId, dealMode: "fixAndFlip" }} />
      <UtilityValue feId={property.onlyChildFeId("utilityValue")} />
      <CapExValue feId={property.onlyChildFeId("capExValue")} />
      <MaintenanceValue feId={property.onlyChildFeId("maintenanceValue")} />
      <CustomExpenses {...feInfo} />
    </PropertyEditorBody>
  );
}

function PropertyEditorBody({
  feId,
  children,
  sectionTitle,
  titleAppend,
}: {
  feId: string;
  children: React.ReactNode;
  sectionTitle: string;
  titleAppend?: string;
}) {
  return (
    <div>
      <MainSectionTopRows
        {...{
          feId,
          sectionName: "property",
          sectionTitle,
          titleAppend,
          showControls: true,
        }}
      />
      <MainSectionBody themeName="property">{children}</MainSectionBody>
    </div>
  );
}
