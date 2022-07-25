import React from "react";
import { auth } from "../../modules/services/authService";
import BtnTooltip from "./BtnTooltip";

type Props = { children: React.ReactElement; className?: string };
export default function LoginToAccessBtnTooltip({
  children,
  className,
}: Props) {
  return (
    <BtnTooltip
      title={auth.isToken ? "" : "Login to click"}
      className={`LoginToAccessBtnTooltip-root ${className ?? ""}`}
    >
      {children}
    </BtnTooltip>
  );
}
