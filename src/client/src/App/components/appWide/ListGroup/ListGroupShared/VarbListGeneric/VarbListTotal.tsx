import { FeVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { useGetterVarb } from "../../../../../sharedWithServer/stateClassHooks/useGetterVarb";

type Props = { varbInfo: FeVarbInfo };
export function VarbListTotal({ varbInfo }: Props) {
  const varb = useGetterVarb(varbInfo);
  return <div className="AdditiveList-total">{`${varb.displayVarb()}`}</div>;
}
