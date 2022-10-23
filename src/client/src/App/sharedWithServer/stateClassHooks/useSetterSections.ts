import { SetterSections } from "../StateSetters/SetterSections";
import { useSetterSectionsProps } from "./useSetterSectionsProps";

export function useSetterSections(): SetterSections {
  const props = useSetterSectionsProps();
  return new SetterSections(props);
}
