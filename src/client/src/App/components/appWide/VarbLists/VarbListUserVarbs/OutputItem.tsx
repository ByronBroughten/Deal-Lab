import styled from "styled-components";
import { useGetterVarb } from "../../../../sharedWithServer/stateClassHooks/useGetterVarb";
import { LabeledEquation } from "../../ListGroup/ListGroupShared/ListItemValue/LabeledEquation";
import { LoadedVarbEditor } from "../../ListGroup/ListGroupShared/ListItemValue/LoadedVarbEditor";
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
    {
      labeledEquation: () => <LabeledEquation {...{ ...feInfo }} />,
      loadedVarb: () => (
        <LoadedVarbEditor {...{ feInfo, valueVarbName: "value" }} />
      ),
    },
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
