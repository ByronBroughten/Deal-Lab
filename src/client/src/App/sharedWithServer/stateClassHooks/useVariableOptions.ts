import { VariableGetterSections } from "../StateEntityGetters/VariableGetterSections";
import { useFullSectionsContext } from "./useFullSectionsContext";

export function useVariableSections(): VariableGetterSections {
  const context = useFullSectionsContext();
  return VariableGetterSections.init(context);
}
