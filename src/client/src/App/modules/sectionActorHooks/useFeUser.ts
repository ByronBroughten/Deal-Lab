import { useSectionsActorProps } from "../../sharedWithServer/stateClassHooks/useSectionActorProps";
import { FeUser } from "../SectionActors/FeUser";

export function useFeUser(): FeUser {
  const props = useSectionsActorProps();
  const { sections } = props.sectionsShare;
  const { feId } = sections.onlyOneRawSection("feStore");
  return new FeUser({
    ...props,
    feId,
  });
}
