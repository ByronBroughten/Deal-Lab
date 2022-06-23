import IfThen from "../../ListGroup/ListGroupShared/ListItemValue/IfThen";
import LabeledEquation from "../../ListGroup/ListGroupShared/ListItemValue/LabeledEquation";
import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

type Props = { feId: string };
export function UserVarbItem({ feId }: Props) {
  const feInfo = { sectionName: "userVarbItem", feId } as const;
  return (
    <VarbListItemGeneric
      {...{
        feInfo,
        switchOptions: {
          labeledEquation: () => <LabeledEquation {...{ feInfo }} />,
          ifThen: () => <IfThen {...{ feId }} />,
        },
      }}
    />
  );
}
