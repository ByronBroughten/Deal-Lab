import { VariableGetterSections } from "../StateEntityGetters/VariableGetterSections";
import { useSectionsContext } from "./useSections";

export function useVariableSections(): VariableGetterSections {
  const { sections } = useSectionsContext();
  return new VariableGetterSections({
    sectionsShare: { sections },
  });
}
