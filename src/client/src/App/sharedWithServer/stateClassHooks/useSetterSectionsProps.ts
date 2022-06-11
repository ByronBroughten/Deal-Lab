import {
  SetterSectionsBase,
  SetterSectionsProps,
} from "../StateSetters/SetterBases/SetterSectionsBase";
import { useSectionsContext } from "./useSections";

export function useSetterSectionsProps(): SetterSectionsProps {
  const { sections, setSections } = useSectionsContext();
  return SetterSectionsBase.initSectionsProps({ sections, setSections });
}
