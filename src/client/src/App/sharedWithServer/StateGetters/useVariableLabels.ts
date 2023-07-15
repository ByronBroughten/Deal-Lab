import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { useGetterSection } from "../stateClassHooks/useGetterSection";
import { ValueInEntityInfo } from "../StateEntityGetters/ValueInEntityInfo";

export interface VarbFinderProps {
  focalInfo: FeSectionInfo;
  varbInfo: ValueInEntityInfo;
}

export const variableNotFoundLabel = "Variable not found";
export function useVariableLabels({ focalInfo, varbInfo }: VarbFinderProps): {
  variableLabel: string;
  infoDot: null | { info: string; title: string };
} {
  const section = useGetterSection(focalInfo);
  const hasVarb = section.hasVarbByFocalMixed(varbInfo);
  if (hasVarb) {
    const varb = section.varbByFocalMixed(varbInfo);

    const { info, title } = varb.varbLabels;

    return {
      variableLabel: varb.variableLabel,
      infoDot: info && title ? { info, title } : null,
    };
  } else {
    return {
      variableLabel: variableNotFoundLabel,
      infoDot: null,
    };
  }
}
