import { GetterSections } from "../StateGetters/GetterSections";
import { useSectionsContext } from "./useSections";

export function useGetterSections(): GetterSections {
  const context = useSectionsContext();
  return new GetterSections(GetterSections.initProps(context));
}
