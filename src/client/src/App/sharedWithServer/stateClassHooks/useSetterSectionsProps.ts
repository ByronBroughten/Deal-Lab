import {
  SetterSectionsBase,
  SetterSectionsProps,
} from "../StateSetters/SetterBases/SetterSectionsBase";
import { useFullSectionsContext } from "./useFullSectionsContext";

export function useSetterSectionsProps(): SetterSectionsProps {
  const props = useFullSectionsContext();
  return SetterSectionsBase.initProps(props);
}
