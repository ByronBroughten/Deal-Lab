import { FeVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { useGetterVarb } from "../../../../../sharedWithServer/stateClassHooks/useGetterVarb";

type Props = { varbInfo: FeVarbInfo };
export function ListGroupTotal({ varbInfo }: Props) {
  const varb = useGetterVarb(varbInfo);
  return <div className="ListGroup-totalText">{varb.displayVarb()}</div>;
}
