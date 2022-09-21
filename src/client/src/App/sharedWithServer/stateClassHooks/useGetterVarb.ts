import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterVarbProps } from "../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { StrictOmit } from "../utils/types";
import { useSectionsContext } from "./useSections";

export interface UseGetterVarbProps<SN extends SectionNameByType>
  extends StrictOmit<GetterVarbProps<SN>, "sectionsShare"> {}

export function useGetterVarb<SN extends SectionNameByType>(
  props: UseGetterVarbProps<SN>
): GetterVarb<SN> {
  const { sections } = useSectionsContext();
  return new GetterVarb({
    ...props,
    sectionsShare: { sections },
  });
}
