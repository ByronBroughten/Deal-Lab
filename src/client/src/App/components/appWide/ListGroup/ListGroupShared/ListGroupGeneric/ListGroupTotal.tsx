import { VarbInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { useGetterVarb } from "../../../../../sharedWithServer/stateClassHooks/useGetterVarb";

type Props = { varbInfo: VarbInfo };
export function ListGroupTotal({ varbInfo }: Props) {
  const varb = useGetterVarb(varbInfo);
  return <div className="ListGroup-titleTotal">({varb.displayVarb()})</div>;
}
