import { useGetterVarb } from "../../../../../../modules/stateHooks/useGetterVarb";
import { FeVarbInfo } from "../../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";

type Props = { varbInfo: FeVarbInfo };
export function ListGroupTotal({ varbInfo }: Props) {
  const varb = useGetterVarb(varbInfo);
  return <div className="ListGroup-totalText">{varb.displayVarb()}</div>;
}
