import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../../sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { useSectionsContext } from "./useMainState";

export function useGetterSectionsProps(): GetterSectionsProps {
  const sections = useSectionsContext();
  return GetterSectionsBase.initProps({ sections });
}
