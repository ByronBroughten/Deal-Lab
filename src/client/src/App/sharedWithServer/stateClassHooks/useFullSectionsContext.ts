import { useSectionContextName } from "./useSectionContextName";
import { useSectionsContext } from "./useSections";

export function useFullSectionsContext() {
  const sectionsContext = useSectionsContext();
  const sectionContextName = useSectionContextName();
  return {
    ...sectionsContext,
    sectionContextName,
  };
}
