import { useGetterVarb } from "../../../../sharedWithServer/stateClassHooks/useGetterVarb";
import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

type Props = { feId: string };
export function UserVarbItem({ feId }: Props) {
  const feInfo = {
    sectionName: "numVarbItem",
    feId,
  } as const;
  const varb = useGetterVarb({
    ...feInfo,
    varbName: "valueEditor",
  });
  return (
    <VarbListItemGeneric {...{ ...feInfo, valueEditorName: "valueEditor" }} />
    // doEquals: varb.isPureUserVarb
  );
}
