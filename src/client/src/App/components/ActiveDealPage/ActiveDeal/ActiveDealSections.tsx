import { MgmtEditor } from "./ActiveDealSections/MgmtEditor";
import { PropertyEditor } from "./ActiveDealSections/PropertyEditor";
import { PurchaseFinancingEditor } from "./ActiveDealSections/PurchaseFinancingEditor";
import { RefiFinancingEditor } from "./ActiveDealSections/RefiFinancingEditor";
import { DealSubSectionOpen } from "./DealSubSectionOpen";
import { useActiveDealSection } from "./useActiveDealSection";

export function ActiveDealProperty() {
  const { isComplete, ...rest } = useActiveDealSection("property");

  return (
    <DealSubSectionOpen {...{ finishIsAllowed: isComplete }}>
      <PropertyEditor
        {...{
          ...rest,
          propertyMode: rest.dealMode,
        }}
      />
    </DealSubSectionOpen>
  );
}

export function ActiveDealPurchaseFi() {
  const { isComplete, ...rest } = useActiveDealSection("purchaseFinancing");
  return (
    <DealSubSectionOpen {...{ finishIsAllowed: isComplete }}>
      <PurchaseFinancingEditor {...rest} />
    </DealSubSectionOpen>
  );
}

export function ActiveDealRefi() {
  const { isComplete, ...rest } = useActiveDealSection("refiFinancing");
  return (
    <DealSubSectionOpen {...{ finishIsAllowed: isComplete }}>
      <RefiFinancingEditor {...rest} />
    </DealSubSectionOpen>
  );
}

export function ActiveDealMgmt() {
  const { isComplete, ...rest } = useActiveDealSection("mgmt");
  return (
    <DealSubSectionOpen {...{ finishIsAllowed: isComplete }}>
      <MgmtEditor {...rest} />
    </DealSubSectionOpen>
  );
}
