import { useSectionsContext } from "../../modules/useSections";
import { SectionName } from "../SectionsMeta/SectionName";
import { StrictOmit } from "../utils/types";
import { GetterVarbProps } from "./Bases/GetterVarbBase";
import { GetterVarb } from "./GetterVarb";

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
