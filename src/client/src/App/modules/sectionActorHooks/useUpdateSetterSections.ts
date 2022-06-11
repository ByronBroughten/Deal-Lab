import React from "react";
import {
  SectionsAndSetSections,
  useSectionsContext,
} from "../../sharedWithServer/stateClassHooks/useSections";

type HasUpdateSetterProps = {
  updateSetterProps: (props: SectionsAndSetSections) => void;
};
export function useUpdateSetterSections<CI extends HasUpdateSetterProps>(
  instance: CI
) {
  const { sections, setSections } = useSectionsContext();
  React.useEffect(() => {
    instance.updateSetterProps({ sections, setSections });
  }, [sections, setSections]);
}
