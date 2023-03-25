import { useSectionsActorProps } from "../../sharedWithServer/stateClassHooks/useSectionActorProps";
import { FeStoreActor } from "../SectionActors/FeStoreActor";

export function useFeStore(): FeStoreActor {
  const props = useSectionsActorProps();
  const { sections } = props.sectionsShare;
  const { feId } = sections.onlyOneRawSection("feStore");
  return new FeStoreActor({
    ...props,
    feId,
  });
}
