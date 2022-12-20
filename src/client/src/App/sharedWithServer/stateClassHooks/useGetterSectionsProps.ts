import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../StateGetters/Bases/GetterSectionsBase";
import { useFullSectionsContext } from "./useFullSectionsContext";

export function useGetterSectionsProps(): GetterSectionsProps {
  const props = useFullSectionsContext();
  return GetterSectionsBase.initProps(props);
}
