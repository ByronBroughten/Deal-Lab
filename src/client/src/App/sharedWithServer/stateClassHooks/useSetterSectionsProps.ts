import { SectionName } from "../SectionsMeta/SectionName";
import { SetterSectionProps } from "../StateSetters/SetterBases/SetterSectionBase";
import {
  SetterSectionsBase,
  SetterSectionsProps,
} from "../StateSetters/SetterBases/SetterSectionsBase";
import { useSectionsContext } from "./useSections";

export function useSetterSectionsProps(): SetterSectionsProps {
  const props = useSectionsContext();
  return SetterSectionsBase.initProps(props);
}

export function useSetterSectionOnlyOneProps<SN extends SectionName>(
  sectionName: SN
): SetterSectionProps<SN> {
  const props = useSectionsContext();
  const raw = props.sections.firstRawSection(sectionName);
  return {
    ...SetterSectionsBase.initProps(props),
    sectionName: raw.sectionName,
    feId: raw.feId,
  };
}
