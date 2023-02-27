import { Outlet, useNavigate } from "react-router-dom";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { PageMain } from "./general/PageMain";

type Props = { children?: React.ReactNode };
function LoginToAccess({ children }: Props) {
  const navigate = useNavigate();
  return (
    <SessionAuth requireAuth={true} redirectToLogin={() => navigate("/auth")}>
      {children}
    </SessionAuth>
  );
}

export function AuthProtectedPage() {
  return (
    <LoginToAccess>
      <PageMain>
        <Outlet />
      </PageMain>
    </LoginToAccess>
  );
}
