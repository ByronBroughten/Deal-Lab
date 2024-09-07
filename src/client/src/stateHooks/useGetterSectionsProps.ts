import { useSectionsContext } from "../ContextsAndProviders/useMainState";
import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../sharedWithServer/StateGetters/Bases/GetterSectionsBase";

export function useGetterSectionsProps(): GetterSectionsProps {
  const sections = useSectionsContext();
  return GetterSectionsBase.initProps({ sections });
}
