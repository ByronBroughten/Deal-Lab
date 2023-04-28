import { DealSubSectionOpen } from "../DealSubSectionOpen";
import { FinancingEditor } from "../FinancingEditor";
import { MgmtEditor } from "../MgmtGeneral/MgmtEditor";
import { useActiveDealSection } from "../useActiveDealSection";
import { PropertyEditor } from "./PropertyEditor";

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
