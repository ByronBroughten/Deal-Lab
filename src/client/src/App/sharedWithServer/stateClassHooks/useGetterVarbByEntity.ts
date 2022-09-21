import { InEntityVarbInfo } from "../SectionsMeta/baseSectionsVarbs/baseValues/entities";
import { GetterSections } from "../StateGetters/GetterSections";
import { useSectionsContext } from "./useSections";

export function useGetterVarbByEntity(entityVarbInfo: InEntityVarbInfo) {
  const { sections } = useSectionsContext();
  const getterSections = new GetterSections({ sectionsShare: { sections } });
  return getterSections.varbByMixed(entityVarbInfo);
}
