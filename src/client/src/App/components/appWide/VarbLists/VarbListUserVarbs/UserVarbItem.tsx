import { VarbListItemSimple } from "../../ListGroup/ListGroupShared/VarbListItemSimple";

type Props = { feId: string };
export function UserVarbItem({ feId }: Props) {
  const feInfo = {
    sectionName: "numVarbItem",
    feId,
  } as const;
  return (
    <VarbListItemSimple {...{ ...feInfo, valueEditorName: "valueEditor" }} />
    // doEquals: varb.isPureUserVarb
  );
}
