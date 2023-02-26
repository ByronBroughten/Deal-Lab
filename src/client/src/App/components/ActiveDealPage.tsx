import { useGetterSectionOnlyOne } from "../sharedWithServer/stateClassHooks/useGetterSection";
import { ActiveDeal } from "./ActiveDealPage/ActiveDeal";
import { NavTopAndSideContainer } from "./general/NavTopAndSideContainer";
import { PageMain } from "./general/PageMain";

export function ActiveDealPage() {
  const main = useGetterSectionOnlyOne("main");
  return (
    <PageMain>
      <NavTopAndSideContainer activeBtnName="deal">
        <ActiveDeal feId={main.onlyChildFeId("activeDealPage")} />
      </NavTopAndSideContainer>
    </PageMain>
  );
}
//
