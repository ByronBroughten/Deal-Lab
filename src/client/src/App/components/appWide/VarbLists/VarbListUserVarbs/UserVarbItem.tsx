import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

type Props = { feId: string };
export function UserVarbItem({ feId }: Props) {
  const feInfo = {
    sectionName: "numVarbItem",
    feId,
  } as const;
  return (
    <VarbListItemGeneric {...{ ...feInfo, valueEditorName: "valueEditor" }} />
    // doEquals: varb.isPureUserVarb
  );
}
