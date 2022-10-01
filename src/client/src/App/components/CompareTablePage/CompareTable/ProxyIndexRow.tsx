import { useGetterSection } from "../../../sharedWithServer/stateClassHooks/useGetterSection";
import { IndexRow } from "./IndexRow";

type Props = { feId: string };
export function ProxyIndexRow({ feId }: Props) {
  const proxy = useGetterSection({
    sectionName: "proxy",
    feId,
  });

  return <IndexRow feId={proxy.valueNext("feId")} />;
}
