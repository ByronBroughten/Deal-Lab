import { useSectionsActorProps } from "../../sharedWithServer/stateClassHooks/useSectionActorProps";
import { FeUserActor } from "../SectionActors/FeUserActor";

export function useFeUser(): FeUserActor {
  const props = useSectionsActorProps();
  const { sections } = props.sectionsShare;
  const { feId } = sections.onlyOneRawSection("feStore");
  return new FeUserActor({
    ...props,
    feId,
  });
}
