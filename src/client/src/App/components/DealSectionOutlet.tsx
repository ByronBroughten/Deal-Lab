import { Outlet } from "react-router-dom";
import { OuterMainSection } from "./appWide/GeneralSection/OuterMainSection";
import { NavTopAndSideContainer } from "./general/NavTopAndSideContainer";
import { NavBtnName } from "./NavBar/AppMenuDropdown";

type Props = { activeBtn: NavBtnName };
export function DealSectionOutlet({ activeBtn }: Props) {
  return (
    <NavTopAndSideContainer activeBtnName={activeBtn}>
      <OuterMainSection>
        <Outlet />
      </OuterMainSection>
    </NavTopAndSideContainer>
  );
}
