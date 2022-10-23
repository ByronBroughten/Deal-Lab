import styled from "styled-components";
import { useGetterVarb } from "../../../../sharedWithServer/stateClassHooks/useGetterVarb";
import { LabeledEquation } from "../../ListGroup/ListGroupShared/ListItemValue/LabeledEquation";
import { LoadedVarbEditor } from "../../ListGroup/ListGroupShared/ListItemValue/LoadedVarbEditor";
import { VarbListItemGeneric } from "../../ListGroup/ListGroupShared/VarbListItemGeneric";

type Props = { feId: string };
export function OutputItem({ feId }: Props) {
  const feInfo = {
    sectionName: "outputItem",
    feId,
  } as const;
  const varb = useGetterVarb({
    ...feInfo,
    varbName: "numObjEditor",
  });
  return (
    <Styled
      {...{
        feInfo,
        switchOptions: {
          labeledEquation: () => (
            <LabeledEquation
              {...{ ...feInfo, doEquals: varb.isPureUserVarb }}
            />
          ),
          loadedVarb: () => (
            <LoadedVarbEditor
              {...{
                feInfo,
                valueVarbName: "value",
                key: feId,
              }}
            />
          ),
        },
      }}
    />
  );
}

const Styled = styled(VarbListItemGeneric)``;
