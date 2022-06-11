import { useSectionsActorProps } from "../../sharedWithServer/stateClassHooks/useSectionActorProps";
import { LoginActor } from "../SectionActors/LoginActor";

export function useLoginActor(): LoginActor {
  const props = useSectionsActorProps();
  const { sections } = props.sectionsShare;
  const { feId } = sections.onlyOneRawSection("login");
  return new LoginActor({
    ...props,
    feId,
  });
}
