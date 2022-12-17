import { useGetterSectionOnlyOne } from "../sharedWithServer/stateClassHooks/useGetterSection";
import { ActiveDeal } from "./ActiveDealPage/ActiveDeal";
import { NavContainer } from "./general/NavContainer";

export function ActiveDealPage() {
  const main = useGetterSectionOnlyOne("main");
  return (
    <NavContainer activeBtnName="deal">
      <ActiveDeal feId={main.onlyChild("activeDeal").feId} />
    </NavContainer>
  );
}
//
