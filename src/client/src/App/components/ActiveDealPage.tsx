import { useGetterSectionOnlyOne } from "../sharedWithServer/stateClassHooks/useGetterSection";
import { SectionPathContext } from "../sharedWithServer/stateClassHooks/useSectionContextName";
import { ActiveDeal } from "./ActiveDealPage/ActiveDeal";
import { NavContainer } from "./general/NavContainer";
import { PageMain } from "./general/PageMain";

export function ActiveDealPage() {
  const main = useGetterSectionOnlyOne("main");
  return (
    <PageMain>
      <NavContainer activeBtnName="deal">
        <SectionPathContext.Provider value="activeDealPage">
          <ActiveDeal feId={main.onlyChild("activeDeal").feId} />
        </SectionPathContext.Provider>
      </NavContainer>
    </PageMain>
  );
}
//
