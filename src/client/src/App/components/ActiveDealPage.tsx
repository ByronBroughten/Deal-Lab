import { useGetterSectionOnlyOne } from "../sharedWithServer/stateClassHooks/useGetterSection";
import { SectionPathContext } from "../sharedWithServer/stateClassHooks/useSectionContextName";
import { ActiveDeal } from "./ActiveDealPage/ActiveDeal";
import { NavTopAndSideContainer } from "./general/NavTopAndSideContainer";
import { PageMain } from "./general/PageMain";

export function ActiveDealPage() {
  const main = useGetterSectionOnlyOne("main");
  return (
    <PageMain>
      <NavTopAndSideContainer activeBtnName="deal">
        <SectionPathContext.Provider value="activeDealPage">
          <ActiveDeal feId={main.onlyChildFeId("activeDealPage")} />
        </SectionPathContext.Provider>
      </NavTopAndSideContainer>
    </PageMain>
  );
}
//
