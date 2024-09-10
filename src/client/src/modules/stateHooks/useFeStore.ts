import { useSectionsContext } from "../../Components/ContextsAndProviders/MainStateProvider";
import { StateValue } from "../../sharedWithServer/stateSchemas/StateValue";
import { GetterFeStore } from "../FeStore/GetterFeStore";

export function useGetterFeStore() {
  const sections = useSectionsContext();
  return new GetterFeStore({ sectionsShare: { sections } });
}

export function useUserDataStatus(): StateValue<"userDataStatus"> {
  const feStore = useGetterFeStore();
  return feStore.get.valueNext("userDataStatus");
}
