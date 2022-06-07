import { SetterSections } from "../StateSetters/SetterSections";
import { useSectionsContext } from "./useSections";

export function useSetterSections(): SetterSections {
  const { sections, setSections } = useSectionsContext();
  return new SetterSections({
    sectionsShare: { sections },
    setSections,
  });
}
