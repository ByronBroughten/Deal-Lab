import { useGetterVarb } from "../../../../../../modules/stateHooks/useGetterVarb";
import { FeVarbInfo } from "../../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";

type Props = { varbInfo: FeVarbInfo };
export function VarbListTotal({ varbInfo }: Props) {
  const varb = useGetterVarb(varbInfo);
  return <div className="VarbList-total">{`${varb.displayVarb()}`}</div>;
}
