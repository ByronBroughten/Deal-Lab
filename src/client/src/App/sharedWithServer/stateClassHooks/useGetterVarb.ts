import { InEntityVarbInfo } from "../SectionsMeta/baseSections/baseValues/entities";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterVarbProps } from "../StateGetters/Bases/GetterVarbBase";
import { GetterSections } from "../StateGetters/GetterSections";
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

export function useGetterVarbEntity<SN extends SectionName>(
  entityVarbInfo: InEntityVarbInfo
) {
  const { sections } = useSectionsContext();
  const getterSections = new GetterSections({ sectionsShare: { sections } });
  return getterSections.varbByMixed(entityVarbInfo);
}
