import { ChildName } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { GetterSection } from "../StateGetters/GetterSection";
import { SetterSection } from "../StateSetters/SetterSection";
import { useGetterSectionOnlyOne } from "./useGetterSection";
import { useSetterSectionOnlyOne } from "./useSetterSection";

export function useGetterMain(): GetterSection<"main"> {
  return useGetterSectionOnlyOne("main");
}

export function useSetterMain(): SetterSection<"main"> {
  return useSetterSectionOnlyOne("main");
}

export function useGetterMainOnlyChild<CN extends ChildName<"main">>(
  childName: CN
): GetterSection<ChildSectionName<"main", CN>> {
  const main = useGetterMain();
  return main.onlyChild(childName);
}
