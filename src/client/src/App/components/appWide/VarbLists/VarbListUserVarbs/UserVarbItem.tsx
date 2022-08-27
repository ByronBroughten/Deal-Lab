import styled from "styled-components";
import LabeledEquation from "../../ListGroup/ListGroupShared/ListItemValue/LabeledEquation";
import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

type Props = { feId: string };
export function UserVarbItem({ feId }: Props) {
  const feInfo = { sectionName: "userVarbItem", feId } as const;
  return (
    <Styled
      {...{
        feInfo,
        switchOptions: {
          labeledEquation: () => <LabeledEquation {...{ feInfo }} />,
          // ifThen: () => <IfThen {...{ feId }} />,
        },
      }}
    />
  );
}

const Styled = styled(VarbListItemGeneric)`
  :hover {
    .AdditiveItem-nextBtn {
      visibility: hidden;
    }
  }
`;
