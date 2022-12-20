import { InEntityVarbInfo } from "../SectionsMeta/baseSectionsVarbs/baseValues/entities";
import { GetterSections } from "../StateGetters/GetterSections";
import { useFullSectionsContext } from "./useFullSectionsContext";

export function useGetterVarbByEntity(entityVarbInfo: InEntityVarbInfo) {
  const context = useFullSectionsContext();
  const getterSections = new GetterSections(GetterSections.initProps(context));
  return getterSections.varbByMixed(entityVarbInfo);
}
