import { useSectionsActorProps } from "../../sharedWithServer/stateClassHooks/useSectionActorProps";
import { RegisterActor } from "../SectionActors/RegisterActor";

export function useRegisterActor(): RegisterActor {
  const props = useSectionsActorProps();
  const { sections } = props.sectionsShare;
  const { feId } = sections.onlyOneRawSection("register");
  return new RegisterActor({
    ...props,
    feId,
  });
}
