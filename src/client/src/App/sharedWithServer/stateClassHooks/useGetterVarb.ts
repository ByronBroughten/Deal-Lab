import { SectionName } from "../SectionsMeta/SectionName";
import { GetterVarbProps } from "../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { StrictOmit } from "../utils/types";
import { useSectionsContext } from "./useSections";

export interface UseGetterVarbProps<SN extends SectionName>
  extends StrictOmit<GetterVarbProps<SN>, "sectionsShare"> {}

export function useGetterVarb<SN extends SectionName>(
  props: UseGetterVarbProps<SN>
): GetterVarb<SN> {
  const { sections } = useSectionsContext();
  return new GetterVarb({
    ...props,
    sectionsShare: { sections },
  });
}
