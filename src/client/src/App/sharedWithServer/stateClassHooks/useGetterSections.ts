import { GetterSections } from "../StateGetters/GetterSections";
import { useSectionsContext } from "./useSections";

export function useGetterSections(): GetterSections {
  const { sections } = useSectionsContext();
  return new GetterSections({
    sectionsShare: { sections },
  });
}
