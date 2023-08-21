import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../StateGetters/Bases/GetterSectionsBase";
import { useSectionsContext } from "./useMainState";

export function useGetterSectionsProps(): GetterSectionsProps {
  const sections = useSectionsContext();
  return GetterSectionsBase.initProps({ sections });
}
