import styled from "styled-components";
import { useGetterVarb } from "../../../../sharedWithServer/stateClassHooks/useGetterVarb";
import { LabeledEquation } from "../../ListGroup/ListGroupShared/ListItemValue/LabeledEquation";
import { VarbListItemStyled } from "../../ListGroup/ListGroupShared/VarbListItemStyled";

type Props = { feId: string };
export function UserVarbItem({ feId }: Props) {
  const feInfo = {
    sectionName: "userVarbItem",
    feId,
  } as const;
  const varb = useGetterVarb({
    ...feInfo,
    varbName: "valueEditor",
  });
  return (
    <Styled
      {...{
        ...feInfo,
        firstCells: (
          <LabeledEquation {...{ ...feInfo, doEquals: varb.isPureUserVarb }} />
        ),
        nextValueSwitch: "labeledEquation",
      }}
    />
  );
}

const Styled = styled(VarbListItemStyled)`
  :hover {
    .AdditiveItem-nextBtn {
      visibility: hidden;
    }
  }
`;
