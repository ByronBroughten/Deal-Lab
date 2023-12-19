import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { feRoutes } from "../../sharedWithServer/Constants/feRoutes";
import { useUserDataStatus } from "../stateClassHooks/useFeStore";
import { useGetterSectionOnlyOne } from "../stateClassHooks/useGetterSection";
import { DealModeProvider } from "./customContexts/dealModeContext";

export function AuthProtectedPage() {
  return (
    <LoginToAccess>
      <DealModeProvider dealMode="mixed">
        <DefaultMainNeededPage>
          <UserDataNeededPage />
        </DefaultMainNeededPage>
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

export function DefaultMainNeededPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const main = useGetterSectionOnlyOne("main");
  if (main.hasOnlyChild("mainDealMenu")) {
    return <div>{children}</div>;
  } else {
    return <Navigate to={feRoutes.handleAuth} />;
  }
}

export function UserDataNeededPage() {
  const userDataStatus = useUserDataStatus();
  return userDataStatus === "notLoaded" ? (
    <Navigate to={feRoutes.handleAuth} />
  ) : (
    <Outlet />
  );
}
