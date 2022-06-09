import { SetterSectionsProps } from "../StateSetters/SetterBases/SetterSectionsBase";
import { useSectionsContext } from "./useSections";

export function useSetterSectionsProps(): SetterSectionsProps {
  const { sections, setSections } = useSectionsContext();
  return {
    setSections,
    sectionsShare: { sections },
  };
}
