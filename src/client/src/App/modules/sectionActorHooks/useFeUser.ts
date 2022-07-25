import { useSectionsActorProps } from "../../sharedWithServer/stateClassHooks/useSectionActorProps";
import { FeUser } from "../SectionActors/FeUser";

export function useFeUser(): FeUser {
  const props = useSectionsActorProps();
  const { sections } = props.sectionsShare;
  const { childFeIds } = sections.onlyOneRawSection("feStore");
  const feId = childFeIds.user[0];
  if (!feId) throw new Error("No user in feStore");
  return new FeUser({
    ...props,
    feId,
  });
}
