import { GetterSection } from "../sharedWithServer/StateGetters/GetterSection";
import { ChildName } from "../sharedWithServer/stateSchemas/derivedFromChildrenSchemas/ChildName";
import { ChildSectionName } from "../sharedWithServer/stateSchemas/derivedFromChildrenSchemas/ChildSectionName";
import { useGetterSectionOnlyOne } from "./useGetterSection";

export function useGetterMain(): GetterSection<"main"> {
  return useGetterSectionOnlyOne("main");
}

export function useGetterMainOnlyChild<CN extends ChildName<"main">>(
  childName: CN
): GetterSection<ChildSectionName<"main", CN>> {
  const main = useGetterMain();
  return main.onlyChild(childName);
}
