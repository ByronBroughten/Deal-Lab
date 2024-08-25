import { FeVarbInfo } from "../../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { useGetterVarb } from "../../../../../stateClassHooks/useGetterVarb";

type Props = { varbInfo: FeVarbInfo };
export function ListGroupTotal({ varbInfo }: Props) {
  const varb = useGetterVarb(varbInfo);
  return <div className="ListGroup-totalText">{varb.displayVarb()}</div>;
}
