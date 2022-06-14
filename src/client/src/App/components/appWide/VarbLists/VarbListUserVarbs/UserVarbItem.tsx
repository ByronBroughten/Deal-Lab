import IfThen from "../../AdditiveListNext/AdditiveItem/IfThen";
import LabeledEquation from "../../AdditiveListNext/AdditiveItem/LabeledEquation";
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
