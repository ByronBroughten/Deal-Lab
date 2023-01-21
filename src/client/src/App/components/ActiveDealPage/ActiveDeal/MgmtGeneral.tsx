import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";

type Props = { className?: string; feId: string };
export function MgmtGeneral({ feId }: Props) {
  const mgmtGeneral = useSetterSection({
    sectionName: "mgmtGeneral",
    feId,
  });
  const mgmt = mgmtGeneral.onlyChild("mgmt");
  return null; // <Mgmt feId={mgmt.feId} />;
}
