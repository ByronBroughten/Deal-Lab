import styled from "styled-components";
import { useGetterVarb } from "../../../../sharedWithServer/stateClassHooks/useGetterVarb";
import { LabeledValueEditor } from "../../ListGroup/ListGroupShared/ListItemValue/LabeledValueEditor";
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
          <LabeledValueEditor
            {...{ ...feInfo, doEquals: varb.isPureUserVarb }}
          />
        ),
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
