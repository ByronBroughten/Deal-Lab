import { Outlet } from "react-router-dom";
import { OuterMainSection } from "./appWide/GeneralSection/OuterMainSection";
import { NavTopAndSideContainer } from "./general/NavTopAndSideContainer";
import { PageMain } from "./general/PageMain";
import { NavBtnName } from "./NavBar/AppMenuDropdown";

type Props = { activeBtnName: NavBtnName };
export function NavContainerSectionOutletPage({ activeBtnName }: Props) {
  return (
    <PageMain>
      <NavTopAndSideContainer activeBtnName={activeBtnName}>
        <OuterMainSection>
          <Outlet />
        </OuterMainSection>
      </NavTopAndSideContainer>
    </PageMain>
  );
}
