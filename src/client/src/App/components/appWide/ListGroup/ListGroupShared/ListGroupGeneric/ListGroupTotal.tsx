import { FeVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterVarb } from "../../../../../sharedWithServer/stateClassHooks/useGetterVarb";

type Props = { varbInfo: FeVarbInfo };
export function ListGroupTotal({ varbInfo }: Props) {
  const varb = useGetterVarb(varbInfo);
  return <div className="ListGroup-totalText">{varb.displayVarb()}</div>;
}
