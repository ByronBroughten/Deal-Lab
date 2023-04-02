import { GetterFeStore } from "../../modules/FeStore/GetterFeStore";
import { useSectionsContext } from "./useSections";

export function useGetterFeStore() {
  const { sections } = useSectionsContext();
  return new GetterFeStore({ sectionsShare: { sections } });
}
