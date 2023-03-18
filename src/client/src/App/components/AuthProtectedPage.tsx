import { Outlet, useNavigate } from "react-router-dom";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { feRoutes } from "../Constants/feRoutes";
import { OuterSectionNext } from "./appWide/GeneralSection/OuterSectionNext";
import { PageMain } from "./general/PageMain";
import { NavBar } from "./NavBar";

export function AuthProtectedPage() {
  return (
    <LoginToAccess>
      <PageMain>
        <NavBar />
        <OuterSectionNext>
          <Outlet />
        </OuterSectionNext>
      </PageMain>
    </LoginToAccess>
  );
}

type Props = { children: React.ReactNode };
function LoginToAccess({ children }: Props) {
  const navigate = useNavigate();
  return (
    <SessionAuth
      requireAuth={true}
      redirectToLogin={() => navigate(feRoutes.auth)}
    >
      {children}
    </SessionAuth>
  );
}
