import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../StateGetters/Bases/GetterSectionsBase";
import { useSectionsContext } from "./useSections";

export function useGetterSectionsProps(): GetterSectionsProps {
  const props = useSectionsContext();
  return GetterSectionsBase.initProps(props);
}
