import { SimpleSectionVarbName } from "../../../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { FeVarbInfo } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterSectionsProps } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSectionsProps";
import { useSetterVarb } from "../../../../../../sharedWithServer/stateClassHooks/useSetterVarb";
import { GetterVarb } from "../../../../../../sharedWithServer/StateGetters/GetterVarb";
import { InEntityGetterVarb } from "../../../../../../sharedWithServer/StateGetters/InEntityGetterVarb";
import {
  DealDetailRowDropDown,
  DealDetailRowEndPoint,
} from "./DealDetailRowStyled";
import { detailsConfig } from "./dealDetailsConfig";

function getDetailDisplayName(varb: GetterVarb) {
  const name = varb.sectionDotVarbName as SimpleSectionVarbName;
  const title = detailsConfig[name as keyof typeof detailsConfig].detailTitle;
  return title ?? varb.displayName;
}

type Props = { varbInfo: FeVarbInfo; level: number };
export function DealDetailRowVarbFound({ varbInfo, level }: Props) {
  const varb = useSetterVarb(varbInfo);
  const { solvableText } = varb.value("numObj");
  const props = {
    varbInfo,
    level,
    displayName: getDetailDisplayName(varb.get),
    displayVarb: varb.get.displayVarb(),
    ...(solvableText !== `${varb.get.numObjOutput}` && { solvableText }),
  };
  const { hasInVarbs } = varb;

  return (
    <>
      {hasInVarbs && <DealDetailRowDropDown {...props} />}
      {!hasInVarbs && <DealDetailRowEndPoint {...props} />}
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
