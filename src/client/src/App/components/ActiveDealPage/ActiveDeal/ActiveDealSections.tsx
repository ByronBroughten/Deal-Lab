import { FinancingEditor } from "./ActiveDealSections/FinancingEditor";
import { MgmtEditor } from "./ActiveDealSections/MgmtEditor";
import { PropertyEditor } from "./ActiveDealSections/PropertyEditor";
import { DealSubSectionOpen } from "./DealSubSectionOpen";
import { useActiveDealSection } from "./useActiveDealSection";

export function ActiveDealProperty() {
  const { isComplete, ...rest } = useActiveDealSection("property");

  return (
    <DealSubSectionOpen {...{ finishIsAllowed: isComplete }}>
      <PropertyEditor {...rest} />
    </DealSubSectionOpen>
  );
}

export function ActiveDealFinancing() {
  const { isComplete, ...rest } = useActiveDealSection("financing");
  return (
    <DealSubSectionOpen {...{ finishIsAllowed: isComplete }}>
      <FinancingEditor {...rest} />
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
