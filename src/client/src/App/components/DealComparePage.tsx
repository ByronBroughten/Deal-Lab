import { DealCompareSection } from "./DealComparePage/DealCompareSection";
import { NavContainerPage } from "./general/NavContainerPage";

export function DealComparePage() {
  return (
    <NavContainerPage activeBtnName="compare">
      <DealCompareSection />
    </NavContainerPage>
  );
}
