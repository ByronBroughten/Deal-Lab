import { useGetterSectionsProps } from "../../../../../../../../modules/stateHooks/useGetterSectionsProps";
import { useGetterVarb } from "../../../../../../../../modules/stateHooks/useGetterVarb";
import { GetterVarb } from "../../../../../../../../sharedWithServer/StateGetters/GetterVarb";
import { FeVarbInfo } from "../../../../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { InEntityGetterVarb } from "../../../../../../../../sharedWithServer/StateGetters/InEntityGetterVarb";
import {
  DealDetailRowDropDown,
  DealDetailRowEndPoint,
} from "./DealDetailRowStyled";

function getDetailDisplayName(varb: GetterVarb) {
  return varb.variableLabel;
}

type Props = { varbInfo: FeVarbInfo; level: number };
export function DealDetailRowVarbFound({ varbInfo, level }: Props) {
  const varb = useGetterVarb(varbInfo);
  const { solvableText } = varb.value("numObj");
  const props = {
    varbInfo,
    level,
    displayName: getDetailDisplayName(varb),
    displayVarb: varb.displayVarb(),
    ...(solvableText !== `${varb.numObjOutput}` && { solvableText }),
  };
  const { hasActiveInEntities } = varb.inEntity;

  return (
    <>
      {hasActiveInEntities && <DealDetailRowDropDown {...props} />}
      {!hasActiveInEntities && <DealDetailRowEndPoint {...props} />}
    </>
  );
}

interface DealDetailRowVarbNotFoundProps {
  entityId: string;
  varbInfo: FeVarbInfo;
  level: number;
}
export function DealDetailRowVarbNotFound({
  varbInfo,
  entityId,
  level,
}: DealDetailRowVarbNotFoundProps) {
  const props = useGetterSectionsProps();
  const varb = new InEntityGetterVarb({
    ...props,
    ...varbInfo,
  });
  return (
    <DealDetailRowEndPoint
      {...{
        level,
        displayName: varb.valueInEntityText(entityId),
        displayVarb: "Not found",
      }}
    />
  );
}

export function DealDetailRowVarbNotFoundTopLevel() {
  return (
    <DealDetailRowEndPoint
      {...{
        level: 0,
        displayName: "Variable not found",
        displayVarb: "Not found",
      }}
    />
  );
}
