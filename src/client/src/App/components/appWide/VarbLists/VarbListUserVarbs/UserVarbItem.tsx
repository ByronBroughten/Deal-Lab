import { VarbListItemSimple } from "../../ListGroup/ListGroupShared/VarbListItemSimple";

type Props = { feId: string };
export function UserVarbItem({ feId }: Props) {
  return (
    <VarbListItemSimple
      {...{
        sectionName: "numVarbItem",
        varbName: "valueEditor",
        feId,
      }}
    />
  );
}
