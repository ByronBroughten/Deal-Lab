import React from "react";
import { useUpdateSetterSections } from "../../modules/sectionActorHooks/useUpdateSetterSections";
import { SetterSections } from "../StateSetters/SetterSections";
import { useSetterSectionsProps } from "./useSetterSectionsProps";

export function useSetterSections(): SetterSections {
  const props = useSetterSectionsProps();
  const setterSections = React.useMemo(() => {
    return new SetterSections(props);
  }, []);
  useUpdateSetterSections(setterSections);
  return setterSections;
}
