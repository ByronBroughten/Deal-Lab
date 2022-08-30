import styled from "styled-components";
import { useGetterVarb } from "../../../../sharedWithServer/stateClassHooks/useGetterVarb";
import LabeledEquation from "../../ListGroup/ListGroupShared/ListItemValue/LabeledEquation";
import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

type Props = { feId: string };
export function UserVarbItem({ feId }: Props) {
  const feInfo = {
    sectionName: "userVarbItem",
    feId,
    varbName: "value",
  } as const;
  const varb = useGetterVarb(feInfo);
  return (
    <Styled
      {...{
        feInfo,
        switchOptions: {
          labeledEquation: () => (
            <LabeledEquation {...{ feInfo, doEquals: varb.isPureUserVarb }} />
          ),
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
