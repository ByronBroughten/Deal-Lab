import { useSectionsContext } from "../ContextsAndProviders/useMainState";
import { GetterSections } from "../sharedWithServer/StateGetters/GetterSections";

export function useGetterSections(): GetterSections {
  const sections = useSectionsContext();
  return new GetterSections(GetterSections.initProps({ sections }));
}
