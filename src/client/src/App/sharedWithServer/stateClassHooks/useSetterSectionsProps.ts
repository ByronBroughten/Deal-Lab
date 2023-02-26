import {
  SetterSectionsBase,
  SetterSectionsProps,
} from "../StateSetters/SetterBases/SetterSectionsBase";
import { useSectionsContext } from "./useSections";

export function useSetterSectionsProps(): SetterSectionsProps {
  const props = useSectionsContext();
  return SetterSectionsBase.initProps(props);
}
