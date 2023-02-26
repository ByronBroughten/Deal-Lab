import { Outlet } from "react-router-dom";
import { OuterMainSection } from "./appWide/GeneralSection/OuterMainSection";
import { NavTopAndSideContainer } from "./general/NavTopAndSideContainer";
import { PageMain } from "./general/PageMain";
import { NavBtnName } from "./NavBar/AppMenuDropdown";

type Props = { activeBtn: NavBtnName };
export function DealSectionOutletPage({ activeBtn }: Props) {
  return (
    <PageMain>
      <NavTopAndSideContainer activeBtnName={activeBtn}>
        <OuterMainSection>
          <Outlet />
        </OuterMainSection>
      </NavTopAndSideContainer>
    </PageMain>
  );
}
