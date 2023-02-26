import { Outlet } from "react-router-dom";
import { PageMain } from "./general/PageMain";
import { NavBar } from "./NavBar";

export function NavBarOutletPage() {
  return (
    <PageMain>
      <NavBar />
      <Outlet />
    </PageMain>
  );
}
