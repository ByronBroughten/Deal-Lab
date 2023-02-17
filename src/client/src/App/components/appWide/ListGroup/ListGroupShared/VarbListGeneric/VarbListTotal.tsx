import { FeVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterVarb } from "../../../../../sharedWithServer/stateClassHooks/useGetterVarb";

type Props = { varbInfo: FeVarbInfo };
export function VarbListTotal({ varbInfo }: Props) {
  const varb = useGetterVarb(varbInfo);
  return <div className="VarbList-total">{`${varb.displayVarb()}`}</div>;
}
