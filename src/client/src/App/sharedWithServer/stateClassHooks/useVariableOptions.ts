import { VariableGetterSections } from "../StateEntityGetters/VariableGetterSections";
import { useSectionsContext } from "./useSections";

export function useVariableSections(): VariableGetterSections {
  const context = useSectionsContext();
  return VariableGetterSections.init(context);
}
