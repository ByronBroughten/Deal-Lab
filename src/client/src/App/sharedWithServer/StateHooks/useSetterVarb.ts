import { SectionName } from "../SectionsMeta/SectionName";
import { GetterVarbProps } from "../StateGetters/Bases/GetterVarbBase";
import { SetterVarb } from "../StateSetters/SetterVarb";
import { StrictOmit } from "../utils/types";
import { useSectionsContext } from "./useSections";

interface UseSetterVarbProps<SN extends SectionName>
  extends StrictOmit<GetterVarbProps<SN>, "sectionsShare"> {}

export function useSetterVarb<SN extends SectionName>(
  props: UseSetterVarbProps<SN>
): SetterVarb<SN> {
  const { sections, setSections } = useSectionsContext();
  return new SetterVarb({
    ...props,
    setSections,
    sectionsShare: { sections },
  });
}
