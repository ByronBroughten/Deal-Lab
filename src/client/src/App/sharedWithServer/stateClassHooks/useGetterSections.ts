import { GetterSections } from "../StateGetters/GetterSections";
import { useFullSectionsContext } from "./useFullSectionsContext";

export function useGetterSections(): GetterSections {
  const context = useFullSectionsContext();
  return new GetterSections(GetterSections.initProps(context));
}
