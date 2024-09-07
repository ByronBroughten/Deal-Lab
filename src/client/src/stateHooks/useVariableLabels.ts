import { FeSectionInfo } from "../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { ValueInEntityInfo } from "../sharedWithServer/StateGetters/Identifiers/ValueInEntityInfo";
import { useGetterSection } from "./useGetterSection";

export interface VarbFinderProps {
  focalInfo: FeSectionInfo;
  varbInfo: ValueInEntityInfo;
}

interface ToReturn {
  variableLabel: string;
  infoProps?: { info: string; title: string };
}

export const variableNotFoundLabel = "Variable not found";
export function useVariableLabels({
  focalInfo,
  varbInfo,
}: VarbFinderProps): ToReturn {
  const section = useGetterSection(focalInfo);
  const hasVarb = section.hasVarbByFocalMixed(varbInfo);
  if (hasVarb) {
    const varb = section.varbByFocalMixed(varbInfo);
    const { info, title } = varb.varbLabels;
    return {
      variableLabel: varb.variableLabel,
      ...(info && title && { infoProps: { info, title } }),
    };
  } else {
    return {
      variableLabel: variableNotFoundLabel,
    };
  }
}
