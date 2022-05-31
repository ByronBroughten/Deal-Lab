import { useSectionsContext } from "../../modules/useSections";
import { InEntityVarbInfo } from "../SectionsMeta/baseSections/baseValues/entities";
import { SectionName } from "../SectionsMeta/SectionName";
import { StrictOmit } from "../utils/types";
import { GetterVarbProps } from "./Bases/GetterVarbBase";
import { GetterSections } from "./GetterSections";
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

export function useGetterVarbEntity<SN extends SectionName>(
  entityVarbInfo: InEntityVarbInfo
) {
  const { sections } = useSectionsContext();
  const sectionsShare = { sections };
  const getterSections = new GetterSections(sectionsShare);
  return getterSections.varbByMixed(entityVarbInfo);
}
