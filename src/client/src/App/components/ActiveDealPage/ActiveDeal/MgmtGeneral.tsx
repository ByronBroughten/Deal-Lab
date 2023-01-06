import React from "react";
import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import { Mgmt } from "./MgmtGeneral/Mgmt";

type Props = { className?: string; feId: string };
export function MgmtGeneral({ feId }: Props) {
  const mgmtGeneral = useSetterSection({
    sectionName: "mgmtGeneral",
    feId,
  });
  const mgmt = mgmtGeneral.onlyChild("mgmt");
  return <Mgmt feId={mgmt.feId} />;
}
