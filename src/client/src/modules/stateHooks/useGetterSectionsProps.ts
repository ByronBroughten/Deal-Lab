import { useSectionsContext } from "../../Components/ContextsAndProviders/MainStateProvider";
import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../../sharedWithServer/StateGetters/Bases/GetterSectionsBase";

export function useGetterSectionsProps(): GetterSectionsProps {
  const sections = useSectionsContext();
  return GetterSectionsBase.initProps({ sections });
}
