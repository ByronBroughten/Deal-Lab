import { GetterSections } from "../StateGetters/GetterSections";
import { useSectionsContext } from "./useMainState";

export function useGetterSections(): GetterSections {
  const sections = useSectionsContext();
  return new GetterSections(GetterSections.initProps({ sections }));
}
