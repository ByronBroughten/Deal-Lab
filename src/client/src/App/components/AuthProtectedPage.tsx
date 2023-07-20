import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { feRoutes } from "../Constants/feRoutes";
import { useUserDataStatus } from "../modules/SectionActors/UserDataActor";
import { useGetterSectionOnlyOne } from "../sharedWithServer/stateClassHooks/useGetterSection";
import { OuterSectionNext } from "./appWide/GeneralSection/OuterSectionNext";
import { DealModeProvider } from "./customContexts/dealModeContext";
import { PageMain } from "./general/PageMain";
import { NavBar } from "./NavBar";

export function UserDataNeededPage() {
  const userDataStatus = useUserDataStatus();
  return userDataStatus === "loaded" ? (
    <Outlet />
  ) : (
    <Navigate to={feRoutes.auth} />
  );
}

export function DefaultMainNeededPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const main = useGetterSectionOnlyOne("main");
  if (main.hasOnlyChild("mainDealMenu")) {
    return <div>{children}</div>;
  } else {
    return <Navigate to={feRoutes.auth} />;
  }
}

export function AuthProtectedPage() {
  return (
    <LoginToAccess>
      <DefaultMainNeededPage>
        <DealModeProvider dealMode="mixed">
          <PageMain>
            <NavBar />
            <OuterSectionNext>
              <Outlet />
            </OuterSectionNext>
          </PageMain>
        </DealModeProvider>
      </DefaultMainNeededPage>
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
