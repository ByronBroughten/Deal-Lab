import { GetterFeStore } from "../../modules/FeStore/GetterFeStore";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { useSectionsContext } from "./useMainState";

export function useGetterFeStore() {
  const sections = useSectionsContext();
  return new GetterFeStore({ sectionsShare: { sections } });
}

export function useUserDataStatus(): StateValue<"userDataStatus"> {
  const feStore = useGetterFeStore();
  return feStore.get.valueNext("userDataStatus");
}
