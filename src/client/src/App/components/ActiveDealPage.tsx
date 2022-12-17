import { useGetterSectionOnlyOne } from "../sharedWithServer/stateClassHooks/useGetterSection";
import { ActiveDeal } from "./ActiveDeal";
import { SidebarContainer } from "./general/SidebarContainer";

export function ActiveDealPage() {
  const main = useGetterSectionOnlyOne("main");
  return (
    <SidebarContainer activeBtnName="deal">
      <ActiveDeal feId={main.onlyChild("activeDeal").feId} />
    </SidebarContainer>
  );
}
