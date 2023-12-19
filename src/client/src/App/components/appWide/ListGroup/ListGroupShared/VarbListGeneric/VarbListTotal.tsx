import { FeVarbInfo } from "../../../../../../sharedWithServer/SectionInfos/FeInfo";
import { useGetterVarb } from "../../../../../stateClassHooks/useGetterVarb";

type Props = { varbInfo: FeVarbInfo };
export function VarbListTotal({ varbInfo }: Props) {
  const varb = useGetterVarb(varbInfo);
  return <div className="VarbList-total">{`${varb.displayVarb()}`}</div>;
}
