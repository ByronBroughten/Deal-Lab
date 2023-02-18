import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

type Props = { feId: string };
export function OutputItem({ feId }: Props) {
  const feInfo = { sectionName: "outputItem", feId } as const;

  return <VarbListItemGeneric {...feInfo} />;
}
