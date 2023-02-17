import styled from "styled-components";
import { useGetterVarb } from "../../../../sharedWithServer/stateClassHooks/useGetterVarb";
import { LabeledValueEditor } from "../../ListGroup/ListGroupShared/ListItemValue/LabeledValueEditor";
import { useOption } from "../../ListGroup/ListGroupShared/useOption";
import { VarbListItemStyled } from "../../ListGroup/ListGroupShared/VarbListItemStyled";

type Props = { feId: string };
export function OutputItem({ feId }: Props) {
  const feInfo = {
    sectionName: "outputItem",
    feId,
  } as const;
  const varb = useGetterVarb({
    ...feInfo,
    varbName: "valueEditor",
  });
  const { option, nextValueSwitch } = useOption(
    { labeledEquation: () => <LabeledValueEditor {...{ ...feInfo }} /> },
    varb.section.valueNext("valueSourceSwitch")
  );
  return (
    <Styled
      {...{
        ...feInfo,
        firstCells: option(),
      }}
    />
  );
}

const Styled = styled(VarbListItemStyled)``;
