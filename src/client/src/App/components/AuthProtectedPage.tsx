import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { feRoutes } from "../Constants/feRoutes";
import { useUserDataStatus } from "../modules/SectionActors/UserDataActor";
import { OuterSectionNext } from "./appWide/GeneralSection/OuterSectionNext";
import { DealModeProvider } from "./customContexts/dealModeContext";
import { PageMain } from "./general/PageMain";
import { ModalProviders } from "./ModalProviders";
import { Modals } from "./Modals";
import { NavBar } from "./NavBar";

export function UserDataNeededPage() {
  const userDataStatus = useUserDataStatus();
  return userDataStatus === "loaded" ? (
    <Outlet />
  ) : (
    <Navigate to={feRoutes.account} />
  );
}

export function AuthProtectedPage() {
  return (
    <LoginToAccess>
      <DealModeProvider dealMode="mixed">
        <ModalProviders>
          <Modals />
          <PageMain>
            <NavBar />
            <OuterSectionNext>
              <Outlet />
            </OuterSectionNext>
          </PageMain>
        </ModalProviders>
      </DealModeProvider>
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
